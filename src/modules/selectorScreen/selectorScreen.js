import { Control, StackPanel } from "@babylonjs/gui";
import { getGlobalUI, clearGlobalUI } from "../../utils/uiManager.js";
import { createMapView, switchFloor } from "./mapView.js";
import { createSearchBar } from "./searchBar.js";
import { createPanel, addControlPanel } from "../../components/panel.js";
import { createButton } from "../../components/button.js";

/**
 * Contenedor principal de la pantalla de selección.
 * @type {StackPanel|null}
 * @private
 */
let selectorContainer = null;
let currentMapMesh = null;
let currentFloor = 0;

/**
 * Inicializa y muestra la pantalla de selección de tiendas.
 * * Configura el buscador superior, el mapa interactivo central y los 
 * controles para cambiar entre la planta baja y la primera planta.
 *
 * @param {Scene} scene - La escena de Babylon donde se renderiza la UI.
 */
export function initSelectorScreen(scene) {
    const ui = getGlobalUI(scene);

    // 1. Crear el mapa base, planta baja por defecto
    currentMapMesh = createMapView(scene, { floor: currentFloor });

    // 2. Contenedor principal para organizar los elementos
    selectorContainer = new StackPanel("selectorContainer");
    selectorContainer.width = "100%";
    selectorContainer.height = "100%";
    ui.addControl(selectorContainer);

    // 3. Añadir Barra de Búsqueda (Parte Superior)
    const searchBar = createSearchBar(scene, {
        placeholder: "BUSCAR TIENDA...",
        onSearch: (text) => console.log("Buscando:", text)
    });
    selectorContainer.addControl(searchBar);

    // 4. Panel de cambio de planta
    const floorPanel = createPanel(scene, {
        name: "floorSelector",
        width: "200px",
        height: "80px",
        verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP
    });
    floorPanel.top = "100px";

    const btnSwitch = createButton(scene, {
        text: "CAMBIAR PLANTA",
        width: "180px",
        height: "40px",
        onClick: () => {
            currentFloor = currentFloor === 0 ? 1 : 0;
            currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
        }
    });

    addControlPanel(floorPanel, btnSwitch);
}

/**
 * Muestra los resultados de una búsqueda en un panel flotante.
 * * @param {Array} results - Lista de tiendas encontradas.
 */
export function showResultsSearch(results) {
    // Aquí se instanciaría el storePanel.js para cada resultado
}

/**
 * Abre el panel detallado de una tienda específica.
 * * @param {Object} store - Datos de la tienda seleccionada.
 */
export function openStorePanel(store) {
    // Lógica para mostrar foto, descripción y botón "Ir a la tienda"
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
    clearGlobalUI();
}