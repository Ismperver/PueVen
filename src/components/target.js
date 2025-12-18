/**
 * Componente Target en el cual se desarrolla la lógica para los
 * marcadores que se utilizarán en el mapa y en el modo AR para 
 * indicar el lugar de una tienda, siendo interactivos.
 * @author Ismael Pérez
 */

import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";

/**
 * @param {import("@babylonjs/core").Scene} scene - Escena de Babylon.
 * @param {Object} options - Configuración del marcador.
 * @param {string} [options.name="targetStore"] - Nombre del marcador.
 * @param {Vector3} [options.position] - Posición inicial.
 * @param {string} [options.color="#00E5FF"] - Color neón.
 * * @returns {import("@babylonjs/core").Mesh} El marcador creado.
 */
export function createTarget(scene, options = {}) {
    const {
        name = "targetStore",
        position = new Vector3(0, 0, 0),
        color = "#00E5FF"
    } = options;

    // Creamos un cono invertido.
    const target = MeshBuilder.CreateCylinder(name, {
        diameterTop: 0.5,
        diameterBottom: 0,
        height: 1,
        tessellation: 16
    }, scene);

    target.position = position;

    // Material con estilo Neón.
    const material = new StandardMaterial(`${name}Mat`, scene);
    const neonColor = Color3.FromHexString(color);
    
    material.diffuseColor = neonColor;
    material.emissiveColor = neonColor; // Hace que brille incluso en zonas oscuras
    material.alpha = 0.8; // Transparencia
    
    target.material = material;

    // Animación simple de levitación sobre el terreno.
    let alpha = 0;
    scene.onBeforeRenderObservable.add(() => {
        alpha += 0.05;
        target.position.y = position.y + Math.sin(alpha) * 0.1;
        target.rotation.y += 0.02;
    });

    return target;
}

/**
 * Elimina el marcador de la escena y libera sus recursos.
 * * @param {import("@babylonjs/core").Mesh} target - La malla del marcador a eliminar.
 */
export function disposeTarget(target) {
    if (target) {
        if (target.material) {
            target.material.dispose();
        }
        target.dispose();
    }
}