import { AdvancedDynamicTexture } from "@babylonjs/gui";

/**
 * Almacena la instancia única de la interfaz de usuario de pantalla completa.
 * Se gestiona como un singleton para asegurar una única capa de UI activa.
 * 
 * @type {import("@babylonjs/gui").AdvancedDynamicTexture|null}
 * @private
 */
let globalUI = null;

/**
 * Recupera o inicializa la instancia global de `AdvancedDynamicTexture` para la interfaz de usuario.
 * Implementa el patrón Singleton para garantizar la consistencia en el manejo de la UI.
 * Si la instancia existente ha sido eliminada o pertenece a una escena diferente, se recrea.
 * Configura la UI para renderizarse al tamaño ideal, optimizando la visualización en dispositivos móviles.
 * 
 * @param {import("@babylonjs/core").Scene} scene - La escena de Babylon.js sobre la cual se proyectará la UI.
 * 
 * @returns {import("@babylonjs/gui").AdvancedDynamicTexture} La instancia activa y válida de la UI global.
 */
export function getGlobalUI(scene) {
  if (globalUI) {
    if (globalUI.isDisposed || globalUI.getScene() !== scene) {
      globalUI.dispose();
      globalUI = null;
    }
  }

  if (!globalUI) {
    globalUI = AdvancedDynamicTexture.CreateFullscreenUI("globalUI", true, scene);
    globalUI.renderAtIdealSize = true;
  }
  return globalUI;
}

/**
 * Elimina todos los controles y limpia el contenido de la UI global de manera segura.
 * Verifica la existencia de la escena y detiene los observables de renderizado antes de limpiar
 * para prevenir errores de referencia nula.
 */
export function clearGlobalUI() {
  if (globalUI && !globalUI.isDisposed) {
    const scene = globalUI.getScene();

    if (scene && !scene.isDisposed) {
      scene.onBeforeRenderObservable.clear();
    }

    globalUI.clear();
  }
}

/**
 * Desecha completamente la instancia de la UI global y libera los recursos asociados.
 * Restablece la referencia global a null, forzando una nueva creación en la próxima solicitud.
 */
export function disposeGlobalUI() {
  if (globalUI && !globalUI.isDisposed) {
    globalUI.dispose();
    globalUI = null;
  }
}