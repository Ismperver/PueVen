import { initARSession } from "./arScene.js";
import { disposeSelector } from "../selectorScreen/selectorScreen.js";
import { getCoordinates } from "../selectorScreen/mapView.js";
import { setupPath, updatePathVisibility, createTargetMarker } from "./arHelpers.js";
import { subtitleText, bigNormalText } from "../../components/textFormat.js";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock, Grid } from "@babylonjs/gui";
import { Vector3 } from "@babylonjs/core";

/**
 * Inicia y gestiona el ciclo de vida de la pantalla de navegación en Realidad Aumentada.
 * Configura la sesión AR, genera la ruta de navegación visual hacia la tienda objetivo y gestiona la interfaz gráfica HUD.
 * Monitoriza la posición del usuario en tiempo real para actualizar las indicaciones.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa.
 * @param {Object} store - Datos de la tienda seleccionada como destino.
 * @param {Function} onBackToMap - Callback para retornar a la vista de mapa (salir de AR).
 */
export async function startARScreen(scene, store, onBackToMap) {
    if (!scene || !store) return;

    disposeSelector();

    const xr = await initARSession(scene);
    if (!xr || !xr.baseExperience) {
        onBackToMap();
        return;
    }

    const destPos = getCoordinates(store.coordenadas, store.planta);

    // Generación de elementos estáticos de la ruta
    const navigationArrows = setupPath(scene, store);
    const targetMarker = createTargetMarker(scene, destPos);

    // --- UI FULLSCREEN (HUD) ---
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("AR_UI", true, scene);

    // Panel Informativo Superior
    const topPanel = new Rectangle("topPanel");
    topPanel.width = "90%";
    topPanel.height = "200px";
    topPanel.background = "#2ecc71";
    topPanel.cornerRadius = 40;
    topPanel.thickness = 0;
    topPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    topPanel.top = "40px";
    advancedTexture.addControl(topPanel);

    const distanceText = new TextBlock("distanceText");
    distanceText.text = "CALCULANDO...";
    distanceText.color = "white";
    distanceText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    distanceText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

    subtitleText(distanceText);
    topPanel.addControl(distanceText);

    // Panel de Control Inferior
    const bottomPanel = new Rectangle("bottomPanel");
    bottomPanel.width = "95%";
    bottomPanel.height = "180px";
    bottomPanel.background = "#3498db";
    bottomPanel.cornerRadius = 40;
    bottomPanel.thickness = 0;
    bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    bottomPanel.bottom = "40px";
    advancedTexture.addControl(bottomPanel);

    // Grilla de organización para el panel inferior
    const grid = new Grid();
    grid.addColumnDefinition(0.65); // 65% espacio para nombre
    grid.addColumnDefinition(0.35); // 35% espacio para botón
    bottomPanel.addControl(grid);

    // Etiqueta del Nombre de la Tienda
    const storeNameText = new TextBlock();
    storeNameText.text = store.nombre.toUpperCase();
    storeNameText.color = "white";
    storeNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    storeNameText.paddingLeft = "40px";

    storeNameText.transformCenterX = 0;
    storeNameText.textWrapping = true;

    bigNormalText(storeNameText);

    grid.addControl(storeNameText, 0, 0);

    // Botón de Retorno
    const backBtn = Button.CreateSimpleButton("backBtn", "VOLVER");
    backBtn.width = "90%";
    backBtn.height = "80%";
    backBtn.color = "white";
    backBtn.background = "#2c3e50";
    backBtn.cornerRadius = 30;
    backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

    if (backBtn.textBlock) {
        backBtn.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        bigNormalText(backBtn.textBlock);
    }

    grid.addControl(backBtn, 0, 1);

    // --- Procedimiento de Limpieza y Salida ---
    const cleanup = async () => {
        scene.onBeforeRenderObservable.remove(renderObserver);
        if (navigationArrows) navigationArrows.forEach(a => a.dispose());
        if (targetMarker) targetMarker.dispose();
        if (advancedTexture) advancedTexture.dispose();
        try { await xr.baseExperience.exitXRAsync(); } catch (e) { }
        onBackToMap();
    };

    backBtn.onPointerUpObservable.add(cleanup);

    // Loop de renderizado para actualizaciones en tiempo real
    const renderObserver = scene.onBeforeRenderObservable.add(() => {
        if (!xr.baseExperience.camera) return;

        const currentPos = xr.baseExperience.camera.position;
        const dist = Vector3.Distance(currentPos, destPos);

        distanceText.text = `FALTAN: ${Math.round(dist)} METROS`;

        updatePathVisibility(navigationArrows, currentPos, destPos);

        if (dist < 3) {
            distanceText.text = "¡LLEGASTE!";
            topPanel.background = "#e67e22";
            navigationArrows.forEach(a => a.setEnabled(false));
        }
    });
}