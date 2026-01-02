/**
 * Utilidad de localización para PueVen Navigator.
 * Convierte coordenadas y gestiona la posición del usuario. 
 */

import { Vector3 } from "@babylonjs/core";

/**
 * Convierte una posición del mapa a un Vector3 de Babylon.
 * @param {string} gridPos - Coordenada del directorio
 * @returns {Vector3} Posición en el mundo 3D.
 */
export function conversorToVector3(gridPos) {
    // Lógica para mapear letras (A-J) y números (7-12) del PDF que utilizamos como base
    const x = gridPos.charCodeAt(0) - 65;
    const z = parseInt(gridPos.substring(1));

    return new Vector3(x * 5, 0, z * 5); // Multiplicador de escala del mapa
}

/**
 * Obtiene la posición actual del usuario mediante los sensores del móvil.
 * Crucial para el cálculo de rutas en tiempo real.
 */
export function userPosition() {
    // Aquí se integraría con el GPS del dispositivo o beacons
    return new Vector3(0, 0, 0);
}