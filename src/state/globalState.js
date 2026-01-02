/**
 * Estado global de la aplicación.
 * Gestiona los datos compartidos y los eventos mediante Observables.
 * @author Ismael Pérez
 */

import { Observable } from "@babylonjs/core";

// --- Variables de Estado --- 
let selectedStore = null;   // Tienda seleccionada actualmente
let isARMode = false;       // ¿Estamos en modo Realidad Aumentada?
let currentDistance = 0;    // Distancia restante a la tienda

// --- Observables (Eventos) --- 
//Notifica cuando el usuario selecciona una tienda en el mapa o buscador
export const onStoreObservable = new Observable();

//Notifica cuando cambia el modo de la aplicación (de Mapa a AR
export const onModeObservable = new Observable();

//Notifica actualizaciones de la distancia en tiempo real
export const onDistanceObservable = new Observable();

// --- Funciones de Gestión --- 

/**Actualiza la tienda seleccionada y notifica a los interesados.
 * @param {Object} store - Datos de la tienda (del JSON).
 */
export function selectStore(store) {
    selectedStore = store;
    onStoreObservable.notifyObservers(store);
}

/**Cambia entre el modo Mapa y el modo AR.
 * @param {boolean} active - True para activar AR.
 */
export function setARMode(active) {
    isARMode = active;
    onModeObservable.notifyObservers(active);
}

/**Actualiza la distancia calculada y notifica a la interfaz.
 * @param {number} distance - Metros restantes.
 */
export function updateGlobalDistance(distance) {
    currentDistance = distance;
    onDistanceObservable.notifyObservers(distance);
}