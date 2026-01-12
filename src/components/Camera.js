import { FreeCamera, UniversalCamera, Vector3, ArcRotateCamera } from "@babylonjs/core";

/**
 * Configura una cámara para el modo de Realidad Aumentada.
 * En este modo, la posición y rotación de la cámara son gestionadas automáticamente por el sistema nativo (ARCore/ARKit)
 * a través de Babylon Native.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena donde se añadirá la cámara.
 * @returns {FreeCamera} Instancia de FreeCamera configurada en el origen.
 */
export function cameraAR(scene) {
    const camera = new FreeCamera("cameraAR", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());
    return camera;
}

/**
 * Configura una cámara libre básica para depuración o vistas sin restricciones.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @returns {FreeCamera} Instancia de FreeCamera posicionada elevada y retrasada.
 */
export function freeCamera(scene) {
    const camera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true);
    return camera;
}

/**
 * Configura una cámara orbital optimizada para la visualización del mapa.
 * Ajustada para facilitar el control táctil (gestos de pinza y arrastre).
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @returns {ArcRotateCamera} Instancia de ArcRotateCamera con límites y sensibilidad ajustados.
 */
export function createMapCamera(scene) {
    const camera = new ArcRotateCamera("mapCamera", -Math.PI / 2, 0, 80, Vector3.Zero(), scene);

    // Configuración de sensibilidad (valores menores implican movimiento más rápido/sensible en algunos contextos,
    // pero aquí se ajustan para una experiencia de usuario fluida).

    // Zoom
    camera.pinchPrecision = 6;
    camera.wheelPrecision = 20;

    // Movimiento (Panning)
    camera.panningSensibility = 500;

    // Rotación
    camera.angularSensibilityX = 800;
    camera.angularSensibilityY = 800;

    // Límites de rotación vertical (Beta)
    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI / 3;

    // Límites de distancia (Radio)
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 150;

    // Inercia para suavizar el movimiento
    camera.inertia = 0.9;

    // Ajuste adicional para panning táctil
    camera.panningSensibility = 250;
    camera.attachControl(true, true);
    return camera;
}

/**
 * Configura una cámara universal para navegación libre en primera persona.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @returns {UniversalCamera} Instancia de UniversalCamera.
 */
export function universalCamera(scene) {
    const camera = new UniversalCamera("universalCamera", new Vector3(0, 10, 0), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true, true);
    return camera;
}

/**
 * Elimina la cámara de la escena y libera los recursos asociados.
 *
 * @param {import("@babylonjs/core").Camera} camera - Cámara a eliminar.
 */
export function disposeCamera(camera) {
    if (camera) {
        camera.dispose();
    }
}