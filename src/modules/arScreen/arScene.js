import { Color4 } from "@babylonjs/core";
import { optimizeForAR, createHemisphereLight } from "../../components/Lights.js";

/**
 * Configura la escena de Babylon.js para optimizarla para Realidad Aumentada.
 * Oculta la geometría del mapa base y ajusta la transparencia del fondo para permitir la superposición
 * de elementos virtuales sobre el feed de la cámara.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa a configurar.
 */
export async function createARScene(scene) {
    const groundMap = scene.getMeshByName("groundMap");
    if (groundMap) groundMap.isVisible = false;

    // Transparencia total del fondo
    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.environmentTexture = null;

    // Descarta el skybox si existe para evitar obstrucción visual
    const skybox = scene.getMeshByName("skyBox");
    if (skybox) skybox.dispose();

    createHemisphereLight(scene);
    optimizeForAR(scene);
}

/**
 * Inicializa y activa la sesión XR (Extended Reality) en modo inmersivo AR.
 * Configura el helper de experiencia XR predeterminado de Babylon.js y establece el espacio de referencia.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena donde se montará la sesión AR.
 * @returns {Promise<import("@babylonjs/core").WebXRDefaultExperience|null>} La instancia del helper XR o null si ocurre un error.
 */
export async function initARSession(scene) {
    try {
        await createARScene(scene);

        const xrHelper = await scene.createDefaultXRExperienceAsync({
            disableDefaultUI: true,
            sessionMode: 'immersive-ar',
            referenceSpaceType: 'unbounded',
            inputOptions: {
                doNotLoadControllerMeshes: true
            },
            disableTeleportation: true
        });

        // Asegura la transparencia del fondo tras la inicialización del contexto XR
        scene.clearColor = new Color4(0, 0, 0, 0);

        await new Promise(resolve => setTimeout(resolve, 100));

        await xrHelper.baseExperience.enterXRAsync('immersive-ar', 'unbounded');

        console.log("Sesión AR activa.");
        return xrHelper;
    } catch (error) {
        console.error("Error al iniciar AR:", error);
        return null;
    }
}