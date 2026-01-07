import { Rectangle, Control } from "@babylonjs/gui";
import { getGlobalUI } from "../utils/uiManager.js";

/**
 * Crea un nuevo panel rectangular para la interfaz de usuario.
 * 
 * Esta función se encarga de configurar todos los estilos básicos (color, tamaño, bordes)
 * y añadirlo automáticamente a la pantalla principal de la escena.
 *
 * @param {Scene} scene - La escena del juego donde se dibujará el panel.
 * @param {Object} options - Opciones para personalizar el panel (ancho, alto, nombre...).
 * @param {string} [options.name="infoPanel"] - Nombre interno para identificar este panel.
 * @param {string|number} [options.width="300px"] - Cuánto mide de ancho.
 * @param {string|number} [options.height="200px"] - Cuánto mide de alto.
 * @param {number} [options.verticalAlignment] - Dónde se pega verticalmente el panel (Arriba, Abajo, Centro).
 * @returns {Rectangle} Devuelve el panel creado para que se pueda añadir cosas después.
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
    panel.background = "rgba(25, 0, 50, 0.85)";
    panel.color = "#BC00FF";

    // Alineación predeterminada
    panel.verticalAlignment = verticalAlignment;
    panel.top = "-20px";

    return panel;
}

/**
 * Añade un elemento (como un botón, texto o imagen) dentro de un panel existente.
 *
 * @param {Rectangle} panel - El panel donde quieres meter el elemento.
 * @param {Control} control - El elemento visual que quieres añadir.
 */
export function addControlPanel(panel, control) {
    if (panel && control) {
        panel.addControl(control);
    }
}

/**
 * Elimina el panel de la memoria y lo quita de la pantalla.
 * Es IMPORTANTE llamar a esta función cuando ya no se necesite el panel
 * para evitar que la aplicación se vuelva lenta.
 * 
 * @param {Rectangle} panel - El panel que se quiera destruir.
 */
export function disposePanel(panel) {
    if (panel) {
        panel.dispose();
    }
}