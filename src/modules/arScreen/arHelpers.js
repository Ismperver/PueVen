import { MeshBuilder, StandardMaterial, Color3, Vector3, Mesh } from "@babylonjs/core";
import { getCoordinates } from "../selectorScreen/mapView.js";

/**
 * Genera una malla compuesta que representa una flecha tridimensional.
 * Combina un cilindro para el eje y otro para la punta, fusionándolos en un solo mesh para optimizar el rendimiento.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa donde se creará la flecha.
 * @param {string} name - Identificador único para el nuevo mesh.
 * @returns {import("@babylonjs/core").Mesh} La flecha 3D creada y materializada.
 */
export function createArrowMesh(scene, name) {
    const shaft = MeshBuilder.CreateCylinder("shaft", {
        height: 1.2, diameter: 0.4, tessellation: 16
    }, scene);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = -0.6;

    const head = MeshBuilder.CreateCylinder("head", {
        diameterTop: 0, diameterBottom: 0.8, height: 0.8, tessellation: 16
    }, scene);
    head.rotation.x = Math.PI / 2;
    head.position.z = 0.4;

    const arrow = Mesh.MergeMeshes([shaft, head], true, true, undefined, false, true);
    arrow.name = name;

    const material = new StandardMaterial(`${name}_mat`, scene);
    material.emissiveColor = new Color3(0, 1, 0);
    material.diffuseColor = new Color3(0, 1, 0);
    material.alpha = 0.9;
    arrow.material = material;

    arrow.scaling = new Vector3(0.6, 0.1, 0.6);
    return arrow;
}

/**
 * Instancia y distribuye una colección de flechas a lo largo de la trayectoria desde el origen hasta el destino.
 * Calcula el vector dirección y posiciona marcadores equidistantes para formar el camino visual.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa.
 * @param {Object} store - Datos de la tienda destino, incluyendo coordenadas y planta.
 * @returns {Array<import("@babylonjs/core").Mesh>} Arreglo con todas las mallas de flechas generadas.
 */
export function setupPath(scene, store) {
    const destPos = getCoordinates(store.coordenadas, store.planta);
    const arrows = [];

    // Origen relativo inicial de la sesión AR
    const startPos = Vector3.Zero();
    const direction = destPos.subtract(startPos).normalize();
    const totalDistance = Vector3.Distance(startPos, destPos);

    // Intervalo de distancia entre flechas consecutivas
    const stepSize = 2.0;

    for (let dist = 2.0; dist < totalDistance; dist += stepSize) {
        const pos = startPos.add(direction.scale(dist));
        // Ajuste vertical para situarlas al nivel del suelo
        pos.y = -1.8;

        const arrow = createArrowMesh(scene, `arrow_${dist}`);
        arrow.position = pos;
        arrow.lookAt(new Vector3(destPos.x, -1.8, destPos.z));

        arrows.push(arrow);
    }
    return arrows;
}

/**
 * Actualiza la visibilidad de los indicadores de camino en función del progreso del usuario.
 * Oculta dinámicamente las flechas que el usuario ya ha sobrepasado para limpiar la interfaz visual.
 *
 * @param {Array<import("@babylonjs/core").Mesh>} arrows - Conjunto de flechas de navegación activas.
 * @param {import("@babylonjs/core").Vector3} userPos - Posición actual de la cámara AR del usuario.
 * @param {import("@babylonjs/core").Vector3} targetPos - Posición objetivo (meta).
 */
export function updatePathVisibility(arrows, userPos, targetPos) {
    if (!arrows) return;

    const distUserToTarget = Vector3.Distance(userPos, targetPos);

    arrows.forEach(arrow => {
        const distArrowToTarget = Vector3.Distance(arrow.position, targetPos);

        // Ocultar flecha si está más lejos del objetivo que el usuario (con margen de tolerancia)
        if (distArrowToTarget > (distUserToTarget + 1.0)) {
            arrow.setEnabled(false);
        } else {
            arrow.setEnabled(true);
        }
    });
}

/**
 * Crea un marcador visual prominente en la ubicación de destino.
 * Utiliza un cono invertido con colores emisivos para indicar claramente la meta.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @param {import("@babylonjs/core").Vector3} position - Coordenadas 3D donde se ubicará el marcador.
 * @returns {import("@babylonjs/core").Mesh} El mesh del marcador creado.
 */
export function createTargetMarker(scene, position) {
    const targetPos = position.clone();
    targetPos.y = 1.5;

    const cone = MeshBuilder.CreateCylinder("targetCone", {
        diameterTop: 1.5, diameterBottom: 0, height: 2.5, tessellation: 32
    }, scene);

    cone.position = targetPos;

    const material = new StandardMaterial("targetMat", scene);
    material.diffuseColor = new Color3(0.5, 0, 1);
    material.emissiveColor = new Color3(0.6, 0.2, 1);
    material.alpha = 0.95;
    cone.material = material;

    return cone;
}