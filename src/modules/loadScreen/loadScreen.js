import { Scene } from "@babylonjs/core";
import { Rectangle, Image, Control, TextBlock } from "@babylonjs/gui";
import { getGlobalUI } from "../../utils/uiManager.js";
import { bigNormalText, normalText } from "../../components/textFormat.js";
import logoAsset from "../../assets/Pueven_logo.png";
import { Image as RNImage } from "react-native";
import { createMapCamera } from "../../components/Camera.js";

/**
 * Almacena la referencia al contenedor de la interfaz de carga.
 * @type {Rectangle|null}
 * @private
 */
let loadingContainer = null;

/**
 * Inicializa la escena de Babylon.js y despliega la interfaz de carga inicial.
 * Configura la cámara óptima para navegación en mapas y ejecuta el renderizado de la pantalla de bienvenida.
 *
 * @param {import("@babylonjs/core").Engine} engine - Instancia del motor de renderizado de Babylon.
 * @returns {Scene} La escena configurada y lista con load screen activo.
 */
export function createScene(engine) {
    const scene = new Scene(engine);
    const camera = createMapCamera(scene);
    showLoadScreen(scene);
    return scene;
}

/**
 * Genera y muestra los elementos gráficos de la pantalla de carga (Splash Screen).
 * Configura el fondo, logotipo y textos de estado utilizando la UI global.
 * Se asegura de limpiar cualquier instancia previa para evitar conflictos visuales.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena sobre la cual se proyecta la interfaz.
 */
export function showLoadScreen(scene) {
    const ui = getGlobalUI(scene);

    if (loadingContainer) {
        disposeLoadScreen();
    }

    // Contenedor principal que ocupa toda la pantalla
    loadingContainer = new Rectangle("loadingContainer");
    loadingContainer.width = "100%";
    loadingContainer.height = "100%";
    loadingContainer.thickness = 0;
    loadingContainer.background = "#0A0A0A";
    ui.addControl(loadingContainer);

    // Panel contenedor del logo para gestión de escala eficiente
    const logoPanel = new Rectangle("logoPanel");
    logoPanel.width = "400px";
    logoPanel.height = "400px";
    logoPanel.thickness = 0;
    logoPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    logoPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logoPanel.scaleX = 0.8;
    logoPanel.scaleY = 0.8;
    loadingContainer.addControl(logoPanel);

    // Imagen del Logo
    const resolvedLogo = RNImage.resolveAssetSource(logoAsset);
    const logo = new Image("logo", resolvedLogo.uri);
    logo.width = "100%";
    logo.height = "100%";
    logoPanel.addControl(logo);

    // Texto de Bienvenida
    const welcomeText = new TextBlock("welcomeText", "BIENVENIDO A PUEVEN");
    welcomeText.color = "#00E5FF";
    welcomeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    welcomeText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    welcomeText.top = "15%";

    bigNormalText(welcomeText);
    loadingContainer.addControl(welcomeText);

    // Texto de estado
    const statusText = new TextBlock("statusText", "CARGANDO...");
    statusText.color = "#BC00FF";
    statusText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    statusText.top = "-15%";

    normalText(statusText);
    loadingContainer.addControl(statusText);
}

/**
 * Actualiza el mensaje de estado mostrado en la pantalla de carga.
 * Permite proporcionar retroalimentación visual al usuario sobre el progreso del sistema.
 *
 * @param {string} message - Cadena de texto con el nuevo estado a visualizar.
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
 * Desmonta y elimina los recursos de la pantalla de carga.
 * Se debe invocar una vez que la carga de assets y lógica principal ha finalizado.
 */
export function disposeLoadScreen() {
    if (loadingContainer) {
        loadingContainer.isVisible = false;
        loadingContainer.dispose();
        loadingContainer = null;
    }
}