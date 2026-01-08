import { TextBlock, Image, Control } from "@babylonjs/gui";
import { createPanel, addControlPanel, disposePanel } from "../../components/Panel.js";
import { createButton } from "../../components/Button.js";
import { normalText, bigNormalText } from "../../components/textFormat.js";

/**
 * Variable para saber el panel actual de la tienda.
 * @private
 */
let currentStorePanel = null;

/**
 * Crea un panel flotante con la información detallada de una tienda seleccionada.
 * Este componente muestra el nombre, la categoría y ofrece un botón para
 * iniciar el guiado en Realidad Aumentada.
 *
 * @param {Scene} scene - La escena de Babylon activa.
 * @param {Object} store - Objeto con los datos de la tienda (extraídos del JSON).
 * @param {Function} onGoToStore - Acción a realizar al pulsar "Ir a la tienda".
 * @returns {void}
 */
export function createPanelStore(scene, store, onGoToStore) {
    // Si ya hay un panel abierto, lo cerramos para evitar solapamientos y errores.
    if (currentStorePanel) {
        disposePanelStore();
    }

    // 1. Crear el contenedor base usando nuestro componente Panel.js
    currentStorePanel = createPanel(scene, {
        name: `panel_${store.nombre}`,
        width: "320px",
        height: "220px",
        verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
    });

    // 2. Nombre de la Tienda
    const title = new TextBlock("storeName", store.nombre.toUpperCase());
    title.color = "#00E5FF";
    title.height = "40px";
    title.top = "-70px";
    bigNormalText(title);
    addControlPanel(currentStorePanel, title);

    // 3. Categoría y Planta
    const info = new TextBlock("storeInfo", `${store.categoria} - PLANTA ${store.planta}`);
    info.color = "#BC00FF";
    info.height = "30px";
    info.top = "-30px";
    normalText(info);
    addControlPanel(currentStorePanel, info);

    // 4. Botón de Acción "IR A LA TIENDA"
    const goBtn = createButton(scene, {
        text: "IR A LA TIENDA",
        width: "200px",
        height: "50px",
        onClick: () => {
            console.log(`Iniciando ruta hacia: ${store.nombre}`);
            if (onGoToStore) onGoToStore(store);
        }
    });
    goBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    goBtn.top = "-20px";

    addControlPanel(currentStorePanel, goBtn);
}

/**
 * Muestra información visual de la tienda dentro del panel
 *
 * @param {string} imageUrl - Ruta del asset de la imagen de la tienda.
 */
export function showInfo(imageUrl) {
    if (currentStorePanel) {
        const img = new Image("storeLogo", imageUrl);
        img.width = "80px";
        img.height = "80px";
        img.top = "20px";
        addControlPanel(currentStorePanel, img);
    }
}

/**
 * Cierra el panel de la tienda y libera los recursos de la memoria.
 * Es crucial llamarlo al cambiar de tienda o volver al mapa principal.
 */
export function disposePanelStore() {
    if (currentStorePanel) {
        disposePanel(currentStorePanel);
        currentStorePanel = null;
    }
}