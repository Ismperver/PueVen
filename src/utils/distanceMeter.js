/**
 * Módulo de utilidades para cálculos de distancia.
 * Proporciona funciones para calcular distancias espaciales y formatear valores para su presentación.
 */
import { Vector3 } from "@babylonjs/core";

/**
 * Calcula la distancia euclidiana entre la posición actual y una posición objetivo en el espacio 3D.
 *
 * @param {Vector3} currentPos - Objeto Vector3 que representa la posición actual del usuario.
 * @param {Vector3} targetPos - Objeto Vector3 que representa la posición de la tienda o destino.
 * @returns {number} Distancia calculada en unidades del motor (metros). Retorna 0 si falta alguna posición.
 */
export function getDistance(currentPos, targetPos) {
    if (!currentPos || !targetPos) return 0;
    return Vector3.Distance(currentPos, targetPos);
}

/**
 * Formatea un valor numérico de distancia para su visualización en la interfaz de usuario.
 *
 * @param {number} distance - Valor de la distancia en metros a formatear.
 * @returns {string} Cadena de texto formateada (ej. "150 METROS") redondeada al entero más cercano.
 */
export function formatMeters(distance) {
    return `${Math.round(distance)} METROS`;
}