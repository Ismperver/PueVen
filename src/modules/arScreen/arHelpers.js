import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";
import { getCoordinates } from "../selectorScreen/mapView.js";

/**
 * Crea una flecha 3D estilizada para el guiado.
 * @param {import("@babylonjs/core").Scene} scene - La escena de Babylon.
 * @param {string} name - Nombre del mesh.
 * @returns {import("@babylonjs/core").Mesh}
 */
export function createGuidanceArrow(scene, name) {
    const arrow = MeshBuilder.CreateCylinder(name, {
        diameterTop: 0,
        diameterBottom: 0.5,
        height: 1,
        tessellation: 6
    }, scene);

    // Material de la flecha.
    const material = new StandardMaterial(`${name}_mat`, scene);
    material.emissiveColor = new Color3(0, 0.9, 1);
    material.alpha = 0.8;
    arrow.material = material;

    // Rotar para que la punta apunte hacia adelante inicialmente
    arrow.rotation.x = Math.PI / 2;
    return arrow;
}

/**
 * Calcula el camino de flechas desde la posición actual al destino.
 * @param {import("@babylonjs/core").Scene} scene 
 * @param {Object} store - Datos de la tienda destino.
 */
export function setupPath(scene, store) {
    const destPos = getCoordinates(store.coordenadas, store.planta);
    const arrowCount = 5;
    const arrows = [];

    for (let i = 1; i <= arrowCount; i++) {
        const arrow = createGuidanceArrow(scene, `arrow_${i}`);
        // Colocamos las flechas en línea hacia el objetivo
        arrow.position = new Vector3(0, 0, i * 3);
        arrow.lookAt(destPos);
        arrows.push(arrow);
    }
    return arrows;
}