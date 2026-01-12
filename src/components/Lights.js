/**
 * Módulo de configuración de iluminación.
 * Define y gestiona las fuentes de luz utilizadas en las diferentes escenas de la aplicación.
 */

import { DirectionalLight, HemisphericLight, Vector3 } from "@babylonjs/core";

/**
 * Crea e inicializa una luz hemisférica para iluminación ambiental.
 * Proporciona una base de luz suave sin sombras, ideal para rendimiento en dispositivos móviles.
 *
 * @param {Scene} scene - Escena activa donde se añadirá la luz.
 * @returns {HemisphericLight} Instancia de la luz hemisférica creada.
 */
export function createHemisphereLight(scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.2;
    return light;
}

/**
 * Crea e inicializa una luz direccional.
 * Simula una fuente de luz lejana (como el sol) para generar sombras y definir volúmenes.
 *
 * @param {Scene} scene - Escena activa donde se añadirá la luz.
 * @returns {DirectionalLight} Instancia de la luz direccional creada.
 */
export function createDirectionalLight(scene) {
    const direction = new Vector3(-1, -2, -1);
    const light = new DirectionalLight("directionalLight", direction, scene);
    light.position = new Vector3(20, 40, 20);
    light.intensity = 1.2;
    light.shadowMinZ = 1;
    light.shadowMaxZ = 250;
    return light;
}

/**
 * Ajusta la configuración de las luces para optimizar la experiencia en Realidad Aumentada.
 * Reduce la intensidad de la luz ambiental y modifica la direccional para integrar mejor
 * los objetos virtuales con la iluminación del entorno real capturado por la cámara.
 *
 * @param {Scene} scene - Escena activa de Babylon.
 */
export function optimizeForAR(scene) {
    const hemiLight = scene.getLightByName("light");
    const dirLight = scene.getLightByName("directionalLight");

    if (hemiLight) {
        hemiLight.intensity = 0.8;
    }

    if (dirLight) {
        dirLight.intensity = 1.0;
        dirLight.direction = new Vector3(0, -1, 0);
    }
}