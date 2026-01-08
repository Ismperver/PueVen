import { InputText, Control, StackPanel, Grid } from "@babylonjs/gui";
import { getGlobalUI } from "../../utils/uiManager.js";
import { normalText } from "../../components/textFormat.js";
import { createButton } from "../../components/Button.js";

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
    input.width = "60%";
    input.height = "80px";
    input.text = "Buscar tienda";
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

    // --- TECLADO MANUAL SIMPLE ---
    // Creamos un teclado de botones simples que NO congela la app
    const keyboardPanel = createManualKeyboard(scene, input);

    // Gestión de visibilidad
    // Detectamos click para mostrar
    input.onPointerUpObservable.add(() => {
        // ui.addControl(keyboardPanel); // Si no fuera hijo de selectorContainer...
        // Pero como selectorContainer suele estar por encima, mejor añadirlo directo a la UI global o manejarlo con visibilidad.
        keyboardPanel.isVisible = true;
    });

    // Ocultar al perder foco (opcional, o mejor con botón "Cerrar" en el teclado)
    // El onBlur a veces salta inesperadamente al pulsar un botón del teclado.
    // Gestionemoslo manual con boton de cerrar.

    input.onBlurObservable.add(() => {
        console.log("Input blur");
    });

    // Propiedad extra para cleanup
    input.manualKeyboard = keyboardPanel;

    return input;
}

/**
 * Crea un teclado manual simple usando Grid y Buttons estándares
 */
function createManualKeyboard(scene, input) {
    const ui = getGlobalUI(scene);

    const container = new StackPanel("keyboardContainer");
    container.width = "100%";
    container.height = "300px";
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    container.background = "#0f0f20"; // Fondo oscuro
    container.isVisible = false; // Oculto por defecto
    container.zIndex = 1000;
    ui.addControl(container);

    // Filas de teclas
    const rows = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
        ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "-"]
    ];

    rows.forEach(rowKeys => {
        const rowPanel = new StackPanel();
        rowPanel.isVertical = false;
        rowPanel.height = "50px";
        container.addControl(rowPanel);

        rowKeys.forEach(key => {
            const btn = createButton(scene, {
                text: key,
                width: "35px",
                height: "40px",
                name: `key_${key}`,
                onClick: () => {
                    input.text += key;
                    // Forzar evento de cambio
                    input.onTextChangedObservable.notifyObservers(input);
                }
            });
            btn.color = "#00FFFF";
            btn.children[0].fontSize = 16; // Texto más pequeño
            btn.paddingLeft = "2px";
            btn.paddingRight = "2px";
            rowPanel.addControl(btn);
        });
    });

    // Fila de acciones (Espacio, Borrar, Cerrar)
    const actionRow = new StackPanel();
    actionRow.isVertical = false;
    actionRow.height = "60px";
    container.addControl(actionRow);

    // Espacio
    const btnSpace = createButton(scene, {
        text: "ESPACIO",
        width: "150px",
        height: "40px",
        name: "key_space",
        onClick: () => {
            input.text += " ";
            input.onTextChangedObservable.notifyObservers(input);
        }
    });
    actionRow.addControl(btnSpace);

    // Borrar
    const btnBackspace = createButton(scene, {
        text: "←",
        width: "60px",
        height: "40px",
        name: "key_backspace",
        onClick: () => {
            input.text = input.text.slice(0, -1);
            input.onTextChangedObservable.notifyObservers(input);
        }
    });
    btnBackspace.color = "#FF0055";
    actionRow.addControl(btnBackspace);

    // Cerrar / Aceptar
    const btnClose = createButton(scene, {
        text: "OK",
        width: "60px",
        height: "40px",
        name: "key_close",
        onClick: () => {
            container.isVisible = false;
            console.log("Teclado cerrado. Búsqueda: ", input.text);
        }
    });
    btnClose.color = "#00FF00";
    actionRow.addControl(btnClose);

    return container;
}

/**
 * Elimina la barra de búsqueda de la interfaz y libera memoria.
 * @param {InputText} input - El control que se desea eliminar.
 */
export function disposeSearchBar(input) {
    if (input) {
        if (input.manualKeyboard) {
            input.manualKeyboard.dispose();
        }
        input.dispose();
    }
}