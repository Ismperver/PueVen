import { Rectangle, Control } from "@babylonjs/gui";
import { getGlobalUI } from "../utils/uiManager.js";

/**
 * Genera un panel rectangular estilizado para la interfaz de usuario.
 * Configura las propiedades visuales (color, bordes, curvatura) y dimensiones del panel,
 * adoptando una estética de neón consistente con la aplicación.
 *
 * @param {Scene} scene - Escena activa donde se renderizará el panel a través de la UI global.
 * @param {Object} options - Objeto de configuración para personalizar el panel.
 * @param {string} [options.name="infoPanel"] - Identificador único del panel.
 * @param {string|number} [options.width="300px"] - Ancho del panel.
 * @param {string|number} [options.height="200px"] - Alto del panel.
 * @param {number} [options.verticalAlignment] - Alineación vertical del panel en la pantalla.
 * @returns {Rectangle} Instancia del control Rectangle creado.
 */
export function createPanel(scene, options = {}) {
    const {
        name = "infoPanel",
        width = "300px",
        height = "200px",
        verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    } = options;

    const ui = getGlobalUI(scene);

    // Crear el rectángulo principal
    const panel = new Rectangle(name);
    panel.width = width;
    panel.height = height;
    panel.cornerRadius = 10;
    panel.thickness = 2;

    // Estética Neón: Morado oscuro translúcido 
    panel.background = "#190032";
    panel.color = "#BC00FF";

    // Alineación predeterminada
    panel.verticalAlignment = verticalAlignment;
    panel.top = "-20px";

    return panel;
}

/**
 * Incorpora un control hijo (botón, texto, imagen, etc.) dentro de un panel contenedor.
 *
 * @param {Rectangle} panel - Panel contenedor donde se agregará el control.
 * @param {Control} control - Elemento de interfaz a añadir.
 */
export function addControlPanel(panel, control) {
    if (panel && control) {
        panel.addControl(control);
    }
}

/**
 * Elimina el panel y libera los recursos asociados.
 * Se debe invocar esta función cuando el panel ya no sea necesario para optimizar el rendimiento.
 *
 * @param {Rectangle} panel - Panel a eliminar.
 */
export function disposePanel(panel) {
    if (panel) {
        panel.dispose();
    }
}