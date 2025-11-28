import { AdvancedDynamicTexture } from "@babylonjs/gui";

/**
 * Instancia global única de la UI fullscreen.
 * Se crea bajo demanda y se reutiliza en toda la aplicación.
 * 
 * @type {import("@babylonjs/gui").AdvancedDynamicTexture|null}
 * @private
 */
let globalUI = null;

/**
 * Obtiene o crea la instancia global de `AdvancedDynamicTexture` fullscreen.
 * 
 * - Si ya existe y no está eliminada, la devuelve.
 * - Si no existe o fue eliminada, crea una nueva con dimensiones ideales.
 * - Configurada para escalar correctamente en diferentes resoluciones.
 * 
 * @param {import("@babylonjs/core").Scene} scene - Escena de Babylon.js donde se renderizará la UI.
 * 
 * @returns {import("@babylonjs/gui").AdvancedDynamicTexture} Instancia activa de la UI global.
 * 
 * @example
 * ```js
 * const ui = getGlobalUI(scene);
 * ui.addControl(myPanel);
 * ```
 */
export function getGlobalUI(scene) {
  if (!globalUI || globalUI.isDisposed) {
    
    /**
     * Crea una UI fullscreen con soporte para escalado automático.
     * @type {import("@babylonjs/gui").AdvancedDynamicTexture}
     */
    globalUI = AdvancedDynamicTexture.CreateFullscreenUI("globalUI", true, scene);
    
  }
  console.log("Creada la UI global...");
  return globalUI;
}

/**
 * Limpia todos los controles de la UI global sin destruirla.
 * 
 * Útil para eliminar paneles temporales (ej: info, menús) sin recrear la textura.
 * 
 * @returns {void}
 * 
 * @example
 * ```js
 * clearGlobalUI(); // Borra todo lo visible
 * showNewPanel();  // Añade nuevo contenido
 * ```
 */
export function clearGlobalUI() {
  if (globalUI && !globalUI.isDisposed) {
    globalUI.clear();
  }
}

/**
 * Elimina completamente la UI global y libera recursos.
 * 
 * - Llama a `dispose()` en la textura.
 * - Establece `globalUI = null` para forzar recreación en el próximo uso.
 * 
 * @returns {void}
 * 
 * @example
 * ```js
 * disposeGlobalUI(); // Limpieza completa al salir de escena
 * ```
 */
export function disposeGlobalUI() {
  if (globalUI && !globalUI.isDisposed) {
    globalUI.dispose();
    globalUI = null;
  }
}