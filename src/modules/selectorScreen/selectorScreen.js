import { Control, Rectangle, TextBlock, StackPanel } from "@babylonjs/gui";
import { getGlobalUI, clearGlobalUI } from "../../utils/uiManager.js";
import { createMapView, switchFloor, getCoordinates } from "./mapView.js";
import { createSearchBar } from "./searchBar.js";
import { createPanel, addControlPanel } from "../../components/Panel.js";
import { createButton } from "../../components/Button.js";
import { createPanelStore } from "./storePanel.js";
import { createTarget, disposeTarget } from "../../components/target.js";
import tiendasData from "../../assets/dataSet/tiendas.json";


/**
 * Contenedor principal de la pantalla de selección.
 * @type {StackPanel|null}
 * @private
 */
let selectorContainer = null;
let floorPanel = null;
let currentMapMesh = null;
let currentFloor = 0;
let currentTarget = null;
let resultsPanel = null;

/**
 * Inicializa y muestra la pantalla de selección de tiendas.
 * Configura el buscador superior, el mapa interactivo central y los 
 * controles para cambiar entre la planta baja y la primera planta.
 *
 * @param {Scene} scene - La escena de Babylon donde se renderiza la UI.
 */
export function initSelectorScreen(scene) {
    // Limpiamos cualquier instancia previa para evitar duplicados
    disposeSelector();

    const ui = getGlobalUI(scene);
    console.log("Pantalla de selección mostrada...");

    // Crear el mapa base, planta baja por defecto.
    currentMapMesh = createMapView(scene, { floor: currentFloor });

    // Contenedor principal 
    selectorContainer = new Rectangle("selectorContainer");
    selectorContainer.width = "100%";
    selectorContainer.height = "100%";
    selectorContainer.thickness = 0;
    ui.addControl(selectorContainer);

    // Añadir la Barra de Búsqueda.
    const searchBar = createSearchBar(scene, {
        placeholder: "BUSCAR TIENDA...",
        onSearch: (text) => {
            const results = tiendasData.tiendas.filter(t =>
                t.nombre.toLowerCase().includes(text.toLowerCase())
            );
            showResultsSearch(scene, results);
        }
    });
    searchBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    searchBar.top = "50px";
    selectorContainer.addControl(searchBar);

    // Botones de cambio de planta.
    // Botón Planta Baja
    const btnFloor0 = createButton(scene, {
        text: "PLANTA BAJA",
        name: "btnFloor0",
        width: "250px",
        height: "80px",
        onClick: () => {
            if (currentFloor !== 0) {
                currentFloor = 0;
                currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
            }
        }
    });
    // Posicionamiento botón planta baja.
    btnFloor0.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnFloor0.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    btnFloor0.left = "80px";
    btnFloor0.top = "-50px";
    selectorContainer.addControl(btnFloor0);

    // Botón Primera Planta.
    const btnFloor1 = createButton(scene, {
        text: "PRIMERA PLANTA",
        name: "btnFloor1",
        width: "250px",
        height: "80px",
        onClick: () => {
            if (currentFloor !== 1) {
                currentFloor = 1;
                currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
            }
        }
    });
    // Posicionamiento boton primera planta.
    btnFloor1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnFloor1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btnFloor1.left = "-80px";
    btnFloor1.top = "-50px";
    selectorContainer.addControl(btnFloor1);
}

/**
 * Muestra los resultados de una búsqueda en un panel flotante.
 * @param {Scene} scene - La escena activa.
 * @param {Array} results - Lista de tiendas encontradas.
 */
export function showResultsSearch(scene, results) {
    if (resultsPanel) {
        resultsPanel.dispose();
    }

    if (!results || results.length === 0) return;

    // Crear panel contenedor de resultados
    resultsPanel = createPanel(scene, {
        name: "resultsPanel",
        width: "300px",
        height: `${Math.min(results.length * 60, 300)}px`, // Altura dinámica
        verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP
    });
    resultsPanel.top = "80px";
    resultsPanel.background = "#2D004B"; // Fondo más sólido (antes rgba)

    selectorContainer.addControl(resultsPanel);

    // StackPanel para alinear los botones verticalmente
    const stack = new StackPanel();
    stack.width = "100%";
    resultsPanel.addControl(stack);

    // Mostrar máximo 5 resultados
    results.slice(0, 5).forEach(store => {
        const btn = createButton(scene, {
            text: store.nombre,
            width: "280px",
            height: "50px",
            onClick: () => openStorePanel(scene, store)
        });
        btn.paddingBottom = "10px";
        stack.addControl(btn);
    });
}

/**
 * Abre el panel detallado de una tienda específica y coloca el marcador.
 * @param {Scene} scene - La escena activa.
 * @param {Object} store - Datos de la tienda seleccionada.
 */
export function openStorePanel(scene, store) {
    // 1. Gestionar cambio de planta si es necesario
    if (store.planta !== currentFloor) {
        currentFloor = store.planta;
        currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
    }

    // 2. Colocar marcador (Target)
    if (currentTarget) {
        disposeTarget(currentTarget);
    }
    const pos = getCoordinates(store.coordenadas);
    // Ajustar altura según planta
    pos.y = currentFloor * 0.5 + 0.1;

    currentTarget = createTarget(scene, {
        position: pos,
        name: `target_${store.nombre}`
    });

    // 3. Abrir Panel de Información
    createPanelStore(scene, store, (s) => {
        console.log("Navegando a:", s.nombre);
        // Aquí iría la lógica de cerrar selector e iniciar AR
    });

    // Limpiar resultados de búsqueda
    if (resultsPanel) {
        resultsPanel.dispose();
        resultsPanel = null;
    }
}

/**
 * * Detiene la vista de mapa y activa los módulos de cámara AR.
 */
export function startARSession() {
    //implementación más tarde.
}

/**
 * Limpia todos los elementos de la pantalla de selección de la memoria.
 * * Es fundamental para cumplir con los requisitos de rendimiento y 
 * evitar solapamientos al entrar en modo AR.
 */
export function disposeSelector() {
    if (selectorContainer) {
        selectorContainer.dispose();
        selectorContainer = null;
    }
    if (currentMapMesh) {
        currentMapMesh.dispose();
        currentMapMesh = null;
    }
    if (currentTarget) {
        disposeTarget(currentTarget);
        currentTarget = null;
    }
    if (resultsPanel) {
        resultsPanel.dispose();
        resultsPanel = null;
    }
    if (floorPanel) {
        floorPanel.dispose();
        floorPanel = null;
    }
    clearGlobalUI();
}