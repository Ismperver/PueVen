import { MeshBuilder, StandardMaterial, Color3, Vector3, Animation } from "@babylonjs/core";
import { getCoordinates } from "../selectorScreen/mapView.js";

/**
 * Crea una flecha de dirección tipo triángulo isósceles alargado.
 * @param {import("@babylonjs/core").Scene} scene 
 * @param {string} name 
 */
export function createGuidanceArrow(scene, name) {
    // Usamos un Disc con 3 lados (triángulo)
    const arrow = MeshBuilder.CreateDisc(name, {
        radius: 0.5,
        tessellation: 3,
    }, scene);

    const material = new StandardMaterial(`${name}_mat`, scene);
    material.emissiveColor = new Color3(0, 1, 0); // Verde neón
    material.diffuseColor = new Color3(0, 1, 0);
    material.alpha = 0.9;
    material.backFaceCulling = false;
    arrow.material = material;

    // 1. Tumbamos el triángulo en el suelo (Rotación X 90 grados)
    arrow.rotation.x = Math.PI / 2;

    // 2. Lo escalamos para que sea Isósceles (Alargado en el eje Y local, que ahora es Z visual)
    // Al tumbarlo, el eje Y local del disco apunta hacia "adelante" o "atrás".
    arrow.scaling = new Vector3(0.6, 1.5, 1); // Estrecho (X) y Largo (Y)

    // Nota: La rotación para apuntar se maneja en setupPath con lookAt
    // Pero a veces el triángulo base de Babylon apunta hacia abajo/arriba. 
    // Ajustaremos la rotación base en setupPath si sale al revés.

    return arrow;
}

/**
 * Genera el camino de flechas pegadas al suelo.
 */
export function setupPath(scene, store) {
    const destPos = getCoordinates(store.coordenadas, store.planta);
    const arrows = [];
    const arrowCount = 12; // Un poco más de densidad

    // Origen (0,0,0) asumiendo inicio de sesión AR
    const startPos = Vector3.Zero();
    const direction = destPos.subtract(startPos).normalize();
    const totalDistance = Vector3.Distance(startPos, destPos);

    for (let i = 1; i < arrowCount; i++) {
        const factor = i / arrowCount;
        const pos = startPos.add(direction.scale(totalDistance * factor));

        // "Más pegados al suelo": Bajamos más la Y.
        // Si el usuario mide 1.70m, el suelo está a -1.7 aprox.
        // Lo ponemos en -1.8 para asegurar que se vea "en el piso"
        pos.y = -1.8;

        const arrow = createGuidanceArrow(scene, `arrow_${i}`);
        arrow.position = pos;

        // Orientar hacia el destino (Solo rotación en Y para que sigan planas)
        arrow.lookAt(new Vector3(destPos.x, pos.y, destPos.z));

        // CORRECCIÓN DE PUNTA:
        // Dependiendo de cómo Babylon crea el triángulo, puede necesitar girar 90º o 180º.
        // Normalmente el vértice 0 está "arriba". Al tumbarlo X=90, mira atrás.
        // Probamos rotación Y + PI para invertir. Ajusta si sale al revés.
        arrow.rotation.y += Math.PI;

        // IMPORTANTE: Al usar lookAt, se resetea la rotación X. Hay que reaplicarla.
        arrow.rotation.x = Math.PI / 2;

        arrows.push(arrow);
    }
    return arrows;
}

/**
 * Crea el Marcador de Destino (CONO INVERTIDO + ALTO).
 */
export function createTargetMarker(scene, position) {
    // "Más altura": Lo subimos a Y = 0.5 (medio metro sobre la cabeza del usuario)
    // o Y = 2.0 desde el suelo. Asumiendo 0 es cabeza, 0.5 es flotando arriba.
    const targetPos = position.clone();
    targetPos.y = 0.5;

    // CONO INVERTIDO: Punta abajo.
    // diameterTop grande, diameterBottom 0.
    const cone = MeshBuilder.CreateCylinder("targetCone", {
        diameterTop: 1.2,    // Ancho arriba
        diameterBottom: 0,   // Punta abajo
        height: 2,
        tessellation: 32
    }, scene);

    cone.position = targetPos;

    const material = new StandardMaterial("targetMat", scene);
    material.diffuseColor = new Color3(0.5, 0, 1); // Morado
    material.emissiveColor = new Color3(0.6, 0.2, 1);
    material.alpha = 0.95;
    cone.material = material;

    // Animación: Flotar suavemente y girar
    const animRot = new Animation("spin", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    animRot.setKeys([{ frame: 0, value: 0 }, { frame: 120, value: Math.PI * 2 }]);

    const animFloat = new Animation("float", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    animFloat.setKeys([
        { frame: 0, value: targetPos.y },
        { frame: 60, value: targetPos.y + 0.5 }, // Sube y baja medio metro
        { frame: 120, value: targetPos.y }
    ]);

    cone.animations.push(animRot);
    cone.animations.push(animFloat);
    scene.beginAnimation(cone, 0, 120, true);

    return cone;
}