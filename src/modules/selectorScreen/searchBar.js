import { InputText, Control, StackPanel } from "@babylonjs/gui";
import { getGlobalUI } from "../../utils/uiManager.js";
import { normalText } from "../../components/textFormat.js";

/**
 * Crea una barra de búsqueda interactiva y predictiva
 * Este componente permite al usuario introducir texto para filtrar tiendas.
 * 
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena donde se dibujará la barra.
 * @param {Object} options - Opciones de personalización.
 * @param {string} [options.placeholder="BUSCAR..."] - Texto que aparece por defecto.
 * @param {Function} [options.onSearch] - Función que se ejecuta al escribir o pulsar Enter.
 * @returns {InputText} El control de entrada de texto creado.
 */
export function createSearchBar(scene, options = {}) {
    const {
        placeholder = "BUSCAR TIENDA...",
        onSearch = null
    } = options;

    // Obtenemos la UI global.
    const ui = getGlobalUI(scene);

    // Crear componente de entrada de texto.
    const input = new InputText("searchBar");
    input.width = "80%";
    input.height = "50px";
    input.text = "";
    input.placeholderText = placeholder;
    input.placeholderColor = "#BC00FF";
    input.color = "#00E5FF";
    input.background = "#2D004B";
    input.focusedBackground = "#2D004B";
    input.thickness = 2;
    input.focusedThickness = 3;
    input.borderColor = "#BC00FF";
    input.fontFamily = "Arial";

    // Alineación superior
    input.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    input.top = "20px";
    input.cornerRadius = 10;

    // Escalado del texto para React Native.
    normalText(input);

    // Observable del texto escrito.
    input.onTextChangedObservable.add((control) => {
        if (onSearch) {
            onSearch(control.text);
        }
    });

    // Observable al perder el foco.
    input.onBlurObservable.add(() => {
        console.log("Búsqueda finalizada: " + input.text);
    });
    return input;
}

/**
 * Elimina la barra de búsqueda de la interfaz y libera memoria.
 * @param {InputText} input - El control que se desea eliminar.
 */
export function disposeSearchBar(input) {
    if (input) {
        input.dispose();
    }
}