import { initARSession } from "./arScene.js";
import { disposeSelector } from "../selectorScreen/selectorScreen.js";
import { getCoordinates } from "../selectorScreen/mapView.js";
import { setupPath, updatePathVisibility, createTargetMarker } from "./arHelpers.js";
// Importamos las funciones de escalado (Asumiendo ruta components/TextFormat.js según estructura común)
import { subtitleText, bigNormalText } from "../../components/textFormat.js";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock, Grid } from "@babylonjs/gui";
import { Vector3 } from "@babylonjs/core";

export async function startARScreen(scene, store, onBackToMap) {
    if (!scene || !store) return;

    disposeSelector();

    const xr = await initARSession(scene);
    if (!xr || !xr.baseExperience) {
        onBackToMap();
        return;
    }

    const destPos = getCoordinates(store.coordenadas, store.planta);

    // 1. CREACIÓN ESTÁTICA (Sin setInterval) para evitar parpadeo
    const navigationArrows = setupPath(scene, store);
    const targetMarker = createTargetMarker(scene, destPos);

    // --- UI FULLSCREEN ---
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("AR_UI", true, scene);

    // PANEL SUPERIOR (Verde)
    const topPanel = new Rectangle("topPanel");
    topPanel.width = "90%";
    topPanel.height = "200px"; // Alto para acomodar texto escalado
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

    // PANEL INFERIOR (Azul)
    const bottomPanel = new Rectangle("bottomPanel");
    bottomPanel.width = "95%";
    bottomPanel.height = "180px";
    bottomPanel.background = "#3498db";
    bottomPanel.cornerRadius = 40;
    bottomPanel.thickness = 0;
    bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    bottomPanel.bottom = "40px";
    advancedTexture.addControl(bottomPanel);

    // Usamos un GRID para organizar Texto (Izq) y Botón (Der)
    const grid = new Grid();
    grid.addColumnDefinition(0.65); // 65% para el nombre
    grid.addColumnDefinition(0.35); // 35% para el botón
    bottomPanel.addControl(grid);

    // Nombre de la Tienda
    const storeNameText = new TextBlock();
    storeNameText.text = store.nombre.toUpperCase();
    storeNameText.color = "white";
    storeNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    storeNameText.paddingLeft = "40px";

    // Configuración para evitar que el escalado mueva el texto fuera de vista
    storeNameText.transformCenterX = 0; // Escalar desde la izquierda
    storeNameText.textWrapping = true;  // Permitir saltos de línea si es muy largo

    // USAMOS TextFormat.js para subtítulo
    bigNormalText(storeNameText);

    grid.addControl(storeNameText, 0, 0);

    // Botón Volver
    const backBtn = Button.CreateSimpleButton("backBtn", "VOLVER");
    backBtn.width = "90%";
    backBtn.height = "80%";
    backBtn.color = "white";
    backBtn.background = "#2c3e50";
    backBtn.cornerRadius = 30;
    backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

    // Accedemos al TextBlock interno del botón para escalarlo
    if (backBtn.textBlock) {
        backBtn.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        bigNormalText(backBtn.textBlock);
    }

    grid.addControl(backBtn, 0, 1);

    // --- LÓGICA DE LIMPIEZA ---
    const cleanup = async () => {
        scene.onBeforeRenderObservable.remove(renderObserver);
        if (navigationArrows) navigationArrows.forEach(a => a.dispose());
        if (targetMarker) targetMarker.dispose();
        if (advancedTexture) advancedTexture.dispose();
        try { await xr.baseExperience.exitXRAsync(); } catch (e) { }
        onBackToMap();
    };

    backBtn.onPointerUpObservable.add(cleanup);

    const renderObserver = scene.onBeforeRenderObservable.add(() => {
        if (!xr.baseExperience.camera) return;

        const currentPos = xr.baseExperience.camera.position;
        const dist = Vector3.Distance(currentPos, destPos);

        distanceText.text = `FALTAN: ${Math.round(dist)} METROS`;

        // Actualizamos qué flechas se ven y cuáles no
        updatePathVisibility(navigationArrows, currentPos, destPos);

        if (dist < 3) {
            distanceText.text = "¡LLEGASTE!";
            topPanel.background = "#e67e22";
            // Opcional: Ocultar todas las flechas al llegar
            navigationArrows.forEach(a => a.setEnabled(false));
        }
    });
}