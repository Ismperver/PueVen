import { clearGlobalUI } from "../../utils/uiManager.js";
import { createMapView, getCoordinates } from "./mapView.js";
import { createTarget, disposeTarget } from "../../components/target.js";
import tiendasData from "../../assets/dataSet/tiendas.json";
import { Vector3, Color3 } from "@babylonjs/core";

/**
 * Referencia al mesh actual del mapa.
 * @type {import("@babylonjs/core").Mesh|null}
 */
let currentMapMesh = null;

/**
 * Almacén de marcadores activos para su posterior limpieza y gestión de memoria.
 * @type {import("@babylonjs/core").Mesh[]}
 */
let storeTargets = [];

/**
 * Almacena el callback de selección de tienda actual.
 * Centraliza la lógica de selección para evitar la propagación de funciones en múltiples llamadas.
 */
let selectionCallback = () => { };

/**
 * Registra el callback global que se ejecutará al seleccionar una tienda.
 *
 * @param {Function} cb - Función que recibe el objeto de la tienda seleccionada como argumento.
 */
export function setSelectionCallback(cb) {
    if (cb) selectionCallback = cb;
}

/**
 * Renderiza los marcadores 3D para todas las tiendas ubicadas en la planta especificada.
 * Realiza una limpieza previa de los marcadores existentes para evitar duplicados.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @param {number} floor - Índice de la planta a visualizar (0 o 1).
 */
export function renderStoreTargets(scene, floor) {
    storeTargets.forEach(target => disposeTarget(target));
    storeTargets = [];

    const tiendasNivel = tiendasData.tiendas.filter(t => t.planta === floor);

    tiendasNivel.forEach(store => {
        const pos = getCoordinates(store.coordenadas, floor);
        pos.y = 0.5;

        const target = createTarget(scene, {
            position: pos,
            name: `target_${store.id}`,
            color: floor === 0 ? "#00E5FF" : "#BC00FF"
        });

        target.isPickable = true;
        target.metadata = { storeData: store };
        storeTargets.push(target);
    });
}

/**
 * Inicializa la lógica visual de la pantalla de selección.
 * Crea el mapa base, instancia los marcadores iniciales y configura los observadores de eventos
 * para la interacción táctil con los elementos 3D.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa de Babylon.
 */
export function initSelectorScreen(scene) {
    disposeSelector();

    currentMapMesh = createMapView(scene, 0);

    renderStoreTargets(scene, 0);

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === 4 && pointerInfo.pickInfo.hit) {
            const pickedMesh = pointerInfo.pickInfo.pickedMesh;
            if (pickedMesh && pickedMesh.metadata && pickedMesh.metadata.storeData) {
                selectionCallback(pickedMesh.metadata.storeData);
            }
        }
    });

    console.log("Selector con marcadores dinámicos inicializado.");
}

/**
 * Reposiciona la cámara para enfocar una tienda específica y aplica un efecto de resaltado visual.
 * Facilita la localización rápida del usuario sobre el mapa.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa.
 * @param {Object} store - Datos de la tienda destino.
 */
export function focusStore(scene, store) {
    if (!scene || !store || !scene.activeCamera) return;

    const pos = getCoordinates(store.coordenadas, store.planta);
    const targetPosition = new Vector3(pos.x, 0, pos.z);
    const camera = scene.activeCamera;

    camera.setTarget(targetPosition);

    if (camera.radius) {
        camera.radius = 45;
    }

    const targetMesh = scene.getMeshByName(`target_${store.id}`);

    if (targetMesh && targetMesh.material) {
        const originalColor = targetMesh.material.emissiveColor.clone();
        targetMesh.material.emissiveColor = Color3.White();

        setTimeout(() => {
            if (targetMesh && targetMesh.material) {
                targetMesh.material.emissiveColor = originalColor;
            }
        }, 500);
    }

    console.log(`Cámara enfocada en: ${store.nombre} (Planta ${store.planta})`);
}

/**
 * Desecha los recursos asociados al selector de pantallas.
 * Elimina el mapa, los marcadores y limpia la interfaz de usuario global,
 * asegurando la liberación de memoria antes de cambiar de contexto (por ejemplo, al pasar a AR).
 */
export function disposeSelector() {
    if (currentMapMesh) {
        currentMapMesh.dispose();
        currentMapMesh = null;
    }
    storeTargets.forEach(target => disposeTarget(target));
    storeTargets = [];

    clearGlobalUI();
}