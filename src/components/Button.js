import { Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { getGlobalUI } from "../utils/uiManager.js";
import { bigNormalText } from "./textFormat.js";

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

    // FIX: Usamos Rectangle en lugar de Button para evitar el freeze de Babylon Native
    // Los controles complejos como Button o InputText parecen causar bloqueos al iniciarse.
    const buttonContainer = new Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.thickness = 2;
    // buttonContainer.cornerRadius = 5; // KEEP DISABLED (Safety First)
    buttonContainer.color = "#00E5FF";
    buttonContainer.background = "#2D004B"; // FIX: Solid Color (No Transparency) prevents freeze
    buttonContainer.isPointerBlocker = true;

    // Efecto visual manual
    buttonContainer.metadata = {
        defaultColor: "#00E5FF",
        defaultBg: "#2D004B", // Solid
        hoverColor: "#FFFFFF",
        hoverBg: "#BC00FF"    // Solid
    };

    // Texto del botón
    const textBlock = new TextBlock(name + "_text", text);
    textBlock.color = "#00E5FF";
    textBlock.fontSize = 18; // FIX: Reasonable size
    textBlock.fontFamily = "Arial";
    textBlock.fontWeight = "bold";
    // Centrado por defecto
    buttonContainer.addControl(textBlock);

    // --- Observables y eventos Manuales ---

    // Al pasar el mouse (Hover)
    buttonContainer.onPointerEnterObservable.add(() => {
        buttonContainer.background = buttonContainer.metadata.hoverBg;
        textBlock.color = buttonContainer.metadata.hoverColor;
    });

    // Al salir del mouse
    buttonContainer.onPointerOutObservable.add(() => {
        buttonContainer.background = buttonContainer.metadata.defaultBg;
        textBlock.color = buttonContainer.metadata.defaultColor;
    });

    // Evento Click
    if (onClick) {
        buttonContainer.onPointerUpObservable.add(onClick);
    }

    // Aplicar escalado de texto si es necesario (helper externo)
    // bigNormalText(textBlock); // REMOVED: Too big


    // Importante: Devolver el contenedor que actúa como botón
    return buttonContainer;
}


/**
 * Elimina el botón específico de la UI.
 */
export function disposeButton(button) {
    if (button) {
        button.dispose();
    }
}