import { initARSession } from "./arScene.js";
import { disposeSelector } from "../selectorScreen/selectorScreen.js";
import { getCoordinates } from "../selectorScreen/mapView.js";
import { setupPath, createTargetMarker } from "./arHelpers.js";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { Vector3 } from "@babylonjs/core";
import { bigNormalText } from "../../components/textFormat.js";

export async function startARScreen(scene, store, onBackToMap) {
    if (!scene || !store) return;

    disposeSelector();

    const xr = await initARSession(scene);

    if (!xr || !xr.baseExperience) {
        console.error("No se pudo iniciar AR");
        onBackToMap();
        return;
    }

    const destPos = getCoordinates(store.coordenadas, store.planta);
    const arrows = setupPath(scene, store);
    const targetMarker = createTargetMarker(scene, destPos);

    // --- INTERFAZ DE USUARIO ---
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("AR_UI", true, scene);

    // 1. PANEL SUPERIOR (DISTANCIA) - TRIPLE DE ALTO
    // Antes 80px -> Ahora 240px
    const topPanel = new Rectangle("topPanel");
    topPanel.width = "90%";       // Más ancho también para que quepa texto grande
    topPanel.height = "240px";    // Triple altura
    topPanel.background = "#2ecc71";
    topPanel.cornerRadius = 40;   // Más redondeado
    topPanel.thickness = 0;
    topPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    topPanel.top = "40px";
    advancedTexture.addControl(topPanel);

    // Texto Distancia - LETRAS MÁS GRANDES
    const distanceText = new TextBlock("distanceText");
    distanceText.text = "CALCULANDO...";
    distanceText.color = "white";
    distanceText.fontWeight = "bold";
    topPanel.addControl(distanceText);
    bigNormalText(distanceText);

    // 2. PANEL INFERIOR (INFO Y VOLVER) - DOBLE DE ALTO
    // Antes 100px -> Ahora 200px
    const bottomPanel = new Rectangle("bottomPanel");
    bottomPanel.width = "95%";
    bottomPanel.height = "200px"; // Doble altura
    bottomPanel.background = "#3498db";
    bottomPanel.cornerRadius = 40;
    bottomPanel.thickness = 0;
    bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    bottomPanel.bottom = "60px";
    advancedTexture.addControl(bottomPanel);

    // StackPanel para organizar texto y botón si se solapan, o grid. 
    // Usaremos posicionamiento relativo simple pero con letras grandes.
    const storeNameText = new TextBlock();
    storeNameText.text = `IR A: ${store.nombre.toUpperCase()}`;
    storeNameText.color = "white";
    storeNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    storeNameText.paddingLeft = "10px";
    // Ajustamos ancho para que no choque con el botón
    storeNameText.width = "60%";
    bottomPanel.addControl(storeNameText);
    bigNormalText(storeNameText);

    // Botón Volver - MÁS GRANDE
    const backBtn = Button.CreateSimpleButton("backBtn", "VOLVER");
    backBtn.width = "150px";
    backBtn.height = "60px";
    backBtn.color = "white";
    backBtn.background = "#2c3e50";
    backBtn.cornerRadius = 30;
    backBtn.fontWeight = "bold";
    backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    backBtn.paddingRight = "80px";
    bottomPanel.addControl(backBtn);
    bigNormalText(backBtn);

    backBtn.onPointerUpObservable.add(async () => {
        scene.onBeforeRenderObservable.remove(renderObserver);
        arrows.forEach(a => a.dispose());
        targetMarker.dispose();
        advancedTexture.dispose();
        try { await xr.baseExperience.exitXRAsync(); } catch (e) { }
        onBackToMap();
    });

    // Loop de actualización
    const renderObserver = scene.onBeforeRenderObservable.add(() => {
        if (!xr.baseExperience.camera) return;

        const currentPos = xr.baseExperience.camera.position;
        const dist = Vector3.Distance(currentPos, destPos);

        distanceText.text = `FALTAN: ${Math.round(dist)} METROS`;

        // Orientar flechas constantemente (opcional si son estáticas)
        // Pero útil si la orientación inicial falló.
        // arrows.forEach(arrow => ...); 

        if (dist < 3) {
            distanceText.text = "¡LLEGASTE!";
            topPanel.background = "#e67e22";
        }
    });
}