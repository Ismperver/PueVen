
/**
 * Componente Lights en el cual se configuran las distintas luces 
 * que se utilizarán para las escenas.
 * @author Ismael Pérez
 */

import { DirectionalLight, HemisphericLight, Vector3 } from "@babylonjs/core";

/**
 * Configura una luz ambiental suave en la escena.
 * 
 * @param {Scene} scene - Escena activa
 * @returns {HemisphericLight} - Instancia de la luz.
 * 
 * @description
 * - Dirección: (0,1,0) vector y desde arriba.
 * - Intensidad: 1.2 ligeramente más brillante que por defecto
 * - No genera sombras que es ideal para rendimiento en móviles
 */
export function createHemisphereLight(scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.2; // Aumenta brillo para mejor visibilidad en móviles
    return light;
}

/**
 * Configura una luz que se puede direccionar.
 *
 * @param {Scene} scene - Escena activa
 * @returns {DirectionalLight} - Instancia de la luz.
 *
 * @description
 * - Crea una luz direccional con dirección y posición definidas.
 * - En Babylon Native es necesario definirposición y dirección.
 * - Ideal para iluminación global, sombras o iluminación lateral.
 */
export function createDirectionalLight(scene) {
    const direction = new Vector3(-1, -2, -1); //Vector para la rafaga de luz
    const light = new DirectionalLight("dirtionalLight", direction, scene);
    light.position = new Vector3(20, 40, 20); //Posición por defecto para crear sombras
    light.intensity = 1.2; // Establecemos una intensidad
    light.shadowMinZ = 1; // Suavizado de la luz
    light.shadowMaxZ = 250;
    return light;
}

/**
 * Optimiza las luces en el modo de realidad aumentada.
 * 
 * @param {Scene} scene - Escena activa
 * @returns {} - Instancia de la luz.
 * 
 * @description
 * - 
 */

export function optimizeForAR(scene) {


}