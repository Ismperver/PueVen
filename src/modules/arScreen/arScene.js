import { Color4 } from "@babylonjs/core";
import { optimizeForAR, createHemisphereLight } from "../../components/Lights.js";

/**
 * Crea la escena Babylon específica del modo AR.
 * Oculta el mapa para permitir la visión del entorno real.
 */
export async function createARScene(scene) {
    const groundMap = scene.getMeshByName("groundMap");
    if (groundMap) groundMap.isVisible = false;

    // Transparencia total del fondo
    scene.clearColor = new Color4(0, 0, 0, 0);

    createHemisphereLight(scene);
    optimizeForAR(scene);
}

/**
 * Configura y activa la sesión de Realidad Aumentada.
 */
export async function initARSession(scene) {
    try {
        await createARScene(scene);

        const xrHelper = await scene.createDefaultXRExperienceAsync({
            disableDefaultUI: true,
            sessionMode: 'immersive-ar',
            referenceSpaceType: 'unbounded'
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        await xrHelper.baseExperience.enterXRAsync('immersive-ar', 'unbounded');

        console.log("Sesión AR activa.");
        return xrHelper;
    } catch (error) {
        console.error("Error al iniciar AR:", error);
        return null;
    }
}