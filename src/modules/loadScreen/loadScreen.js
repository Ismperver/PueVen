import { Scene } from "@babylonjs/core";
import { Rectangle, Image, Control, TextBlock } from "@babylonjs/gui";
import { getGlobalUI, clearGlobalUI } from "../../utils/uiManager.js";
import { bigNormalText, normalText } from "../../components/textFormat.js";
import logoAsset from "../../assets/Pueven_logo.png";
import { Image as RNImage } from "react-native";
import { universalCamera } from "../../components/Camera.js";
/**
 * Variable local para guardar el contenedor de la pantalla de carga.
 * @type {Rectangle|null}
 * @private
 */
let loadingContainer = null;

/**
 * Crea la escena inicial de Babylon.js y activa la interfaz de carga.
 * Esta función es el punto de entrada principal que invoca el motor de Babylon.js
 * al arrancar la aplicación en el dispositivo móvil.
 *
 * @param {import("@babylonjs/core").Engine} engine - El motor de renderizado de Babylon.
 * @returns {Scene} La escena de carga inicial.
 */
export function createScene(engine) {
    const scene = new Scene(engine);

    const camera = universalCamera(scene);
    camera.position.z = -5;
    // Ejecuta la pantalla de carga
    showLoadScreen(scene);

    return scene;
}

/**
 * Crea y muestra la pantalla de carga con el logo y el mensaje de bienvenida.
 * Esta función prepara la primera impresión del usuario, configurando el fondo,
 * el logo del centro comercial y los textos.
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
    ui.addControl(loadingContainer);

    // Imagen del Logo.
    const resolvedLogo = RNImage.resolveAssetSource(logoAsset);
    const logo = new Image("logo", resolvedLogo.uri);
    logo.width = "250px";
    logo.height = "250px";
    logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logo.top = "50px";
    loadingContainer.addControl(logo);

    // Texto de Bienvenida 
    const welcomeText = new TextBlock("welcomeText", "BIENVENIDO A PUEVEN");
    welcomeText.color = "#00E5FF";
    welcomeText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    welcomeText.top = "100px";

    // Aplicación de escala estándar del texto.
    bigNormalText(welcomeText);
    loadingContainer.addControl(welcomeText);

    // Texto de estado "Cargando..."
    const statusText = new TextBlock("statusText", "CARGANDO...");
    statusText.color = "#BC00FF";
    statusText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    statusText.top = "-60px";

    // Aplicación de escala estándar del texto.
    normalText(statusText);
    loadingContainer.addControl(statusText);

    console.log("Pantalla de carga mostrada...");
}

/**
 * Simula el progreso de carga o muestra un mensaje específico de sistema.
 * Útil para dar feedback al usuario.
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
 * Es vital llamar a esta función cuando el mapa o la escena AR estén listos
 * para liberar memoria.
 */
export function disposeLoadScreen() {
    if (loadingContainer) {
        loadingContainer.dispose();
        loadingContainer = null;
        console.log("Pantalla de carga eliminada.");
    }
}