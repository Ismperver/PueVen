import { Rectangle, Image, Control, TextBlock } from "@babylonjs/gui";
import { getGlobalUI, clearGlobalUI } from "../../utils/uiManager.js";
import { bigNormalText, normalText } from "../../components/textFormat.js";

/**
 * Variable local para guardar el contenedor de la pantalla de carga.
 * @type {Rectangle|null}
 * @private
 */
let loadingContainer = null;

/**
 * Crea y muestra la pantalla de carga con el logo y el mensaje de bienvenida.
 * * Esta función prepara la primera impresión del usuario, configurando el fondo,
 * el logo del centro comercial y los textos animados.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena donde se creará la interfaz.
 * @returns {void}
 */
export function showLoadScreen(scene) {
    const ui = getGlobalUI(scene);

    // Contenedor principal que ocupa toda la pantalla
    loadingContainer = new Rectangle("loadingContainer");
    loadingContainer.width = "100%";
    loadingContainer.height = "100%";
    loadingContainer.thickness = 0;
    loadingContainer.background = "#0A0A0A";

    // Imagen del Logo.
    const logo = new Image("logo", "assets/Pueven_logo.png");
    logo.width = "250px";
    logo.height = "250px";
    logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logo.top = "-50px";
    loadingContainer.addControl(logo);

    // Texto de Bienvenida 
    const welcomeText = new TextBlock("welcomeText", "BIENVENIDO A PUEVEN");
    welcomeText.color = "#00E5FF";
    welcomeText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    welcomeText.top = "100px";
    bigNormalText(welcomeText);
    loadingContainer.addControl(welcomeText);

    // Texto de estado "Cargando..."
    const statusText = new TextBlock("statusText", "CARGANDO SISTEMAS...");
    statusText.color = "#BC00FF";
    statusText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    statusText.top = "-60px";
    normalText(statusText);
    loadingContainer.addControl(statusText);

    ui.addControl(loadingContainer);
    console.log("Pantalla de carga mostrada...");
}

/**
 * Simula el progreso de carga o muestra un mensaje específico de sistema.
 * Útil para dar feedback al usuario mientras se inician los módulos AR.
 *
 * @param {string} message - El mensaje que se quiere mostrar.
 */
export function updateLoadStatus(message) {
    if (loadingContainer) {
        const textControl = loadingContainer.getChildByName("statusText");
        if (textControl) {
            textControl.text = message.toUpperCase();
        }
    }
}

/**
 * Elimina la pantalla de carga para dar paso a la aplicación principal.
 * * Es vital llamar a esta función cuando el mapa o la escena AR estén listos
 * para liberar memoria y permitir la interacción del usuario.
 */
export function disposeLoadScreen() {
    if (loadingContainer) {
        loadingContainer.dispose();
        loadingContainer = null;
        console.log("Pantalla de carga eliminada.");
    }
}