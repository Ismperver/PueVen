import { FreeCamera, UniversalCamera, Vector3, ArcRotateCamera } from "@babylonjs/core";

/**
 * Crea una cámara para el modo de Realidad Aumentada.
 * En AR, la posición y rotación suelen ser controladas por el sistema nativo.
 * * @param {import("@babylonjs/core").Scene} scene 
 * @returns {FreeCamera}
 */
export function cameraAR(scene) {
    // Se utiliza una FreeCamera situada en el origen; 
    // Babylon Native sincroniza automáticamente esta cámara con los sensores del móvil.
    const camera = new FreeCamera("cameraAR", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());
    return camera;
}

/**
 * Cámara básica sin restricciones.
 * * @param {import("@babylonjs/core").Scene} scene 
 * @returns {FreeCamera}
 */
export function freeCamera(scene) {
    const camera = new FreeCamera("freeCamera", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true); // Permite movimiento manual en desarrollo
    return camera;
}

/**
 * Cámara para el manejo de la interfaz y navegación.
 * * @param {import("@babylonjs/core").Scene} scene 
 * @returns {UniversalCamera}
 */
export function universalCamera(scene) {
    const camera = new UniversalCamera("universalCamera", new Vector3(0, 10, 0), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true, true);
    return camera;
}

/**
 * Elimina de forma segura la cámara y libera los recursos.
 * * @param {import("@babylonjs/core").Camera} camera 
 */
export function disposeCamera(camera) {
    if (camera) {
        camera.dispose();
    }
}