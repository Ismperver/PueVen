import { MeshBuilder, StandardMaterial, Color3, Vector3, Mesh } from "@babylonjs/core";
import { getCoordinates } from "../selectorScreen/mapView.js";

/**
 * Crea una flecha 3D compuesta (Palo + Punta).
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
 * Genera TODAS las flechas desde el origen (0,0,0) hasta el destino.
 * Se llama una sola vez al iniciar AR para evitar parpadeos.
 */
export function setupPath(scene, store) {
    const destPos = getCoordinates(store.coordenadas, store.planta);
    const arrows = [];

    // Origen relativo sesión AR
    const startPos = Vector3.Zero();
    const direction = destPos.subtract(startPos).normalize();
    const totalDistance = Vector3.Distance(startPos, destPos);

    // Flechas cada 2 metros
    const stepSize = 2.0;

    // Creamos flechas cubriendo todo el camino
    for (let dist = 2.0; dist < totalDistance; dist += stepSize) {
        const pos = startPos.add(direction.scale(dist));
        pos.y = -1.8; // Pegadas al suelo

        const arrow = createArrowMesh(scene, `arrow_${dist}`);
        arrow.position = pos;
        arrow.lookAt(new Vector3(destPos.x, -1.8, destPos.z));

        arrows.push(arrow);
    }
    return arrows;
}

/**
 * Gestiona la visibilidad de las flechas para simular avance.
 * Oculta las flechas que han quedado detrás del usuario.
 */
export function updatePathVisibility(arrows, userPos, targetPos) {
    if (!arrows) return;

    // Distancia del usuario al objetivo
    const distUserToTarget = Vector3.Distance(userPos, targetPos);

    arrows.forEach(arrow => {
        // Distancia de la flecha al objetivo
        const distArrowToTarget = Vector3.Distance(arrow.position, targetPos);

        // Si la flecha está más lejos del objetivo que el usuario (+ un margen de 2m),
        // significa que el usuario ya la pasó. La ocultamos.
        // Si la flecha está delante (distancia menor al target), la mostramos.
        if (distArrowToTarget > (distUserToTarget + 1.0)) {
            arrow.setEnabled(false);
        } else {
            arrow.setEnabled(true);
        }
    });
}

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