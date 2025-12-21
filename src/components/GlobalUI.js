import { AdvancedDynamicTexture } from "@babylonjs/gui";

let globalUI = null;

/**
 * Obtiene o crea la instancia única de la interfaz de usuario (AdvancedDynamicTexture).
 * Implementa el patrón Singleton para asegurar que solo haya una capa de UI activa.
 * 
 * @param {Scene} scene - La escena de Babylon.js donde se renderizará la UI.
 * @returns {AdvancedDynamicTexture} La textura avanzada de UI global.
 */
export function getGlobalUI(scene) {
    if (!globalUI) {
        globalUI = AdvancedDynamicTexture.CreateFullscreenUI("globalUI", true, scene);
    }
    return globalUI;
}

/**
 * Elimina la instancia de UI actual y limpia los recursos.
 * Útil al cambiar de escena o reiniciar el contexto gráfico.
 */
export function clearGlobalUI() {
    if (globalUI) {
        globalUI.dispose();
        globalUI = null;
    }
}
