/**
 * Módulo de geolocalización.
 * Encargado de las conversiones de coordenadas y la gestión de la posición del usuario en el espacio virtual.
 */

import { Vector3 } from "@babylonjs/core";

/**
 * Convierte una referencia de cuadrícula alfanumérica en un vector de posición en el espacio 3D.
 * Realiza el mapeo basado en las coordenadas del mapa (Letras para X, Números para Z).
 *
 * @param {string} gridPos - Cadena que representa la coordenada de cuadrícula (ej. "A10").
 * @returns {Vector3} Objeto Vector3 correspondiente a la posición en el mundo 3D.
 */
export function conversorToVector3(gridPos) {
    const x = gridPos.charCodeAt(0) - 65;
    const z = parseInt(gridPos.substring(1));

    return new Vector3(x * 5, 0, z * 5);
}

/**
 * Obtiene la posición actual estimada del usuario.
 * Esta función sirve como punto de integración para servicios de geolocalización o beacons.
 *
 * @returns {Vector3} Vector3 que representa la posición actual del usuario en el origen (0,0,0) por defecto.
 */
export function userPosition() {
    return new Vector3(0, 0, 0);
}