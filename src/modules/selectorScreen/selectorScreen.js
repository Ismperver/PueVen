import { Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { getGlobalUI, clearGlobalUI } from "../../utils/uiManager.js";
import { createMapView, switchFloor } from "./mapView.js";
import { createSearchBar } from "./searchBar.js";
import { createPanel, addControlPanel } from "../../components/Panel.js";
import { createButton } from "../../components/Button.js";

/**
 * Contenedor principal de la pantalla de selección.
 * @type {StackPanel|null}
 * @private
 */
let selectorContainer = null;
// Variables para el mapa y el panel de plantas
let floorPanel = null;
let currentMapMesh = null;
let currentFloor = 0;

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
        onSearch: (text) => console.log("Buscando:", text)
    });
    searchBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    searchBar.top = "50px";
    selectorContainer.addControl(searchBar);

    // Botones de cambio de planta.
    // Botón Planta Baja
    const btnFloor0 = createButton(scene, {
        text: "PLANTA BAJA",
        name: "btnFloor0",
        width: "130px",
        height: "40px",
        onClick: () => {
            if (currentFloor !== 0) {
                currentFloor = 0;
                currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
            }
        }
    });
    // Posicionamiento botón planta baja.
    btnFloor0.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnFloor0.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    btnFloor0.left = "-80px";
    btnFloor0.top = "-50px";
    selectorContainer.addControl(btnFloor0);

    // Botón Primera Planta.
    const btnFloor1 = createButton(scene, {
        text: "PRIMERA PLANTA",
        name: "btnFloor1",
        width: "130px",
        height: "40px",
        onClick: () => {
            if (currentFloor !== 1) {
                currentFloor = 1;
                currentMapMesh = switchFloor(currentMapMesh, currentFloor, scene);
            }
        }
    });
    // Posicionamiento boton primera planta.
    btnFloor1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnFloor1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    btnFloor1.left = "80px";
    btnFloor1.top = "-50px";
    selectorContainer.addControl(btnFloor1);
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
    if (floorPanel) {
        floorPanel.dispose();
        floorPanel = null;
    }
    clearGlobalUI();
}