import { Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { getGlobalUI } from "./GlobalUI.js";
import { bigNormalText } from "./TextFormat.js";

/**
 * Crea un botón con estilo neón y lo añade a la UI global.
 * @param {Object} options - Configuración del botón.
 * @param {string} options.text - Texto del botón.
 * @param {string} [options.name="neonBtn"] - Nombre interno del control.
 * @param {string} [options.width="200px"] - Ancho del botón.
 * @param {string} [options.height="60px"] - Alto del botón.
 * @param {Function} [options.onClick] - Callback al hacer click.
 */
export function createButton(scene, options = {}) {
    const {
        text = "CLICK",
        name = "neonBtn",
        width = "200px",
        height = "60px",
        onClick = null
    } = options;

    const ui = getGlobalUI(scene);

    // Contenedor principal.
    const button = Button.CreateSimpleButton(name, text);
    button.width = width;
    button.height = height;
    button.color = "#00E5FF";
    button.fontSize = 20;
    button.fontFamily = "Segoe UI, Arial, sans-serif";
    button.fontWeight = "bold";

    // Estilo de fondo y borde (Morado neón)
    button.background = "rgba(45, 0, 75, 0.8)";
    button.thickness = 2;
    button.cornerRadius = 5;
    button.hoverCursor = "pointer";

    // Efecto de iluminación en los bordes
    button.outlineWidth = 2;
    button.outlineColor = "#BC00FF";

    // --- Observables y eventos ---

    // Al pasar el mouse (Hover)
    button.onPointerEnterObservable.add(() => {
        button.background = "#BC00FF";
        button.color = "#FFFFFF";
    });

    // Al salir del mouse
    button.onPointerOutObservable.add(() => {
        button.background = "rgba(45, 0, 75, 0.8)";
        button.color = "#00E5FF";
    });

    // Evento Click
    if (onClick) {
        button.onPointerUpObservable.add(onClick);
    }

    ui.addControl(button);
    bigNormalText(button.textBlock);
    this.container = button;

    return button;
}


/**
 * Elimina el botón específico de la UI.
 */
export function disposeButton() {
    if (this.container) {
        this.container.dispose();
        this.container = null;
    }
}