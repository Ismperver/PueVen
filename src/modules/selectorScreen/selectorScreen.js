import { clearGlobalUI } from "../../utils/uiManager.js";
import { createMapView, getCoordinates } from "./mapView.js";
import { createTarget, disposeTarget } from "../../components/target.js";
import tiendasData from "../../assets/dataSet/tiendas.json";
// IMPORTANTE: Importamos Vector3 y Color3 para evitar el ReferenceError en dispositivos móviles (Hermes)
import { Vector3, Color3 } from "@babylonjs/core";

/** * Referencia al mesh actual del mapa.
 * @type {import("@babylonjs/core").Mesh|null} 
 */
let currentMapMesh = null;

/** * Almacén de marcadores activos para su posterior limpieza y gestión de memoria.
 * @type {import("@babylonjs/core").Mesh[]} 
 */
let storeTargets = [];
/**
 * Variable global para almacenar el callback de selección de tienda.
 * Evita tener que pasarlo en cada llamada de inicialización.
 */
let selectionCallback = () => { };

/**
 * Configura el callback que se ejecutará al pulsar una tienda.
 * @param {Function} cb - Función (store) => void
 */
export function setSelectionCallback(cb) {
    if (cb) selectionCallback = cb;
}

export function renderStoreTargets(scene, floor) {
    // 1. Limpieza exhaustiva de marcadores existentes del nivel anterior
    storeTargets.forEach(target => disposeTarget(target));
    storeTargets = [];

    // 2. Filtrado de tiendas según la planta activa del repositorio JSON
    const tiendasNivel = tiendasData.tiendas.filter(t => t.planta === floor);

    tiendasNivel.forEach(store => {
        const pos = getCoordinates(store.coordenadas, floor);
        // Ajustamos la altura del marcador sobre el plano del mapa
        pos.y = 0.5;

        const target = createTarget(scene, {
            position: pos,
            name: `target_${store.id}`,
            color: floor === 0 ? "#00E5FF" : "#BC00FF"
        });

        // Configuración de interactividad para el sistema de picking
        target.isPickable = true;
        target.metadata = { storeData: store };
        storeTargets.push(target);
    });
}

/**
 * Inicializa la pantalla de selección, crea el mapa base e instancia los marcadores del nivel inicial.
 * Además, configura el gestor de eventos de puntero para detectar interacciones en 3D.
 * * @param {import("@babylonjs/core").Scene} scene - La escena activa de Babylon.
 * @param {Function} onStoreSelected - Callback de React para manejar la selección de tienda.
 */
// Eliminamos el parámetro onStoreSelected ya que usaremos el global
export function initSelectorScreen(scene) {
    disposeSelector();

    // Crear el mapa de la planta baja (0) por defecto
    currentMapMesh = createMapView(scene, 0);

    // Dibujar los marcadores iniciales sin pasar callback (ya usan el global si fuera necesario, o interactividad por pointer)
    renderStoreTargets(scene, 0);

    // Gestor de eventos de puntero global para detectar taps en los targets 3D
    scene.onPointerObservable.add((pointerInfo) => {
        // Tipo 4 corresponde al evento de presionar (PointerDown)
        if (pointerInfo.type === 4 && pointerInfo.pickInfo.hit) {
            const pickedMesh = pointerInfo.pickInfo.pickedMesh;
            // Verificamos si el objeto pulsado es un marcador con datos asociados
            if (pickedMesh && pickedMesh.metadata && pickedMesh.metadata.storeData) {
                // Usamos la variable global
                selectionCallback(pickedMesh.metadata.storeData);
            }
        }
    });

    console.log("Selector con marcadores dinámicos inicializado.");
}

/**
 * Enfoca la cámara en una tienda específica y aplica un efecto visual de resaltado neón.
 * * @param {import("@babylonjs/core").Scene} scene - La escena activa.
 * @param {Object} store - Datos de la tienda seleccionada desde la UI de React.
 */
export function focusStore(scene, store) {
    if (!scene || !store || !scene.activeCamera) return;

    const pos = getCoordinates(store.coordenadas, store.planta);
    const targetPosition = new Vector3(pos.x, 0, pos.z);
    const camera = scene.activeCamera;

    // Centramos la cámara sobre la tienda seleccionada
    camera.setTarget(targetPosition);

    // Ajustamos el zoom para una vista de detalle
    if (camera.radius) {
        camera.radius = 45;
    }

    // Buscamos el mesh del marcador para aplicar un efecto de "flash"
    const targetMesh = scene.getMeshByName(`target_${store.id}`);

    if (targetMesh && targetMesh.material) {
        // Efecto visual: Cambio temporal de color a blanco intenso
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
 * Libera de la memoria el mapa, los marcadores y limpia los elementos de la interfaz.
 * Es fundamental para evitar fugas de memoria y asegurar un rendimiento óptimo en móviles.
 */
export function disposeSelector() {
    if (currentMapMesh) {
        currentMapMesh.dispose();
        currentMapMesh = null;
    }
    // Eliminación segura de todos los marcadores 3D activos
    storeTargets.forEach(target => disposeTarget(target));
    storeTargets = [];

    clearGlobalUI();
}