/**
 * Módulo de generación de marcadores (Targets).
 * Crea elementos 3D interactivos que señalan la ubicación de las tiendas en el entorno virtual o AR.
 */

import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";

/**
 * Crea e instancia un marcador visual en la escena.
 * El marcador consiste en un cono invertido animado con un material de estilo neón.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena donde se renderizará el marcador.
 * @param {Object} options - Configuración de propiedades del marcador.
 * @param {string} [options.name="targetStore"] - Identificador del mesh.
 * @param {Vector3} [options.position] - Posición inicial en el espacio 3D.
 * @param {string} [options.color="#00E5FF"] - Color del material en formato hexadecimal.
 * @returns {import("@babylonjs/core").Mesh} La malla 3D (Mesh) del marcador creado.
 */
export function createTarget(scene, options = {}) {
    const {
        name = "targetStore",
        position = new Vector3(0, 0, 0),
        color = "#00E5FF"
    } = options;

    const target = MeshBuilder.CreateCylinder(name, {
        diameterTop: 0.5,
        diameterBottom: 0,
        height: 1,
        tessellation: 16
    }, scene);

    target.position = position;

    const material = new StandardMaterial(`${name}Mat`, scene);
    const neonColor = Color3.FromHexString(color);

    material.diffuseColor = neonColor;
    material.emissiveColor = neonColor;
    material.alpha = 0.8;

    target.material = material;

    // Configura una animación de levitación y rotación continua
    let alpha = 0;
    scene.onBeforeRenderObservable.add(() => {
        alpha += 0.05;
        target.position.y = position.y + Math.sin(alpha) * 0.1;
        target.rotation.y += 0.02;
    });

    return target;
}

/**
 * Elimina el marcador de la escena y libera los recursos gráficos asociados (malla y material).
 *
 * @param {import("@babylonjs/core").Mesh} target - Objeto Mesh del marcador a eliminar.
 */
export function disposeTarget(target) {
    if (target) {
        if (target.material) {
            target.material.dispose();
        }
        target.dispose();
    }
}