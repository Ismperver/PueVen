/**
 * Utilidad para calcular y formatear la distancia al objetivo.
 */
import { Vector3 } from "@babylonjs/core";

/**
 * Calcula la distancia entre la posición actual y el destino.
 * @param {Vector3} currentPos - Posición del usuario.
 * @param {Vector3} targetPos - Posición de la tienda.
 * @returns {number} Distancia en metros.
 */
export function getDistance(currentPos, targetPos) {
    if (!currentPos || !targetPos) return 0;
    // Babylon usa unidades que mapeamos 1:1 a metros en este proyecto
    return Vector3.Distance(currentPos, targetPos);
}

/**
 * Formatea la distancia para mostrarla en la UI.
 */
export function formatMeters(distance) {
    return `${Math.round(distance)} METROS`;
}