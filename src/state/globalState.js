/**
 * Módulo de gestión del estado global de la aplicación.
 * Utiliza Observables de Babylon.js para administrar la comunicación de eventos y datos compartidos entre componentes.
 */

import { Observable } from "@babylonjs/core";

// --- Variables de Estado --- 
let selectedStore = null;   // Almacena la tienda seleccionada actualmente
let isARMode = false;       // Indica si la aplicación se encuentra en modo Realidad Aumentada
let currentDistance = 0;    // Almacena la distancia restante hasta el objetivo

// --- Observables (Eventos) --- 

/**
 * Observable que notifica a los suscriptores cuando se selecciona una tienda.
 * Se dispara al interactuar con el mapa o el buscador.
 */
export const onStoreObservable = new Observable();

/**
 * Observable que notifica a los suscriptores cuando cambia el modo de visualización.
 * Indica la transición entre el modo Mapa y el modo Realidad Aumentada.
 */
export const onModeObservable = new Observable();

/**
 * Observable que notifica actualizaciones de la distancia en tiempo real.
 * Utilizado para actualizar la interfaz durante la navegación.
 */
export const onDistanceObservable = new Observable();

// --- Funciones de Gestión --- 

/**
 * Actualiza la tienda seleccionada en el estado global y notifica el cambio a los observadores.
 *
 * @param {Object} store - Objeto que contiene los datos de la tienda seleccionada.
 */
export function selectStore(store) {
    selectedStore = store;
    onStoreObservable.notifyObservers(store);
}

/**
 * Establece el estado del modo AR y notifica el cambio a los observadores.
 *
 * @param {boolean} active - Valor booleano que indica si el modo AR debe activarse.
 */
export function setARMode(active) {
    isARMode = active;
    onModeObservable.notifyObservers(active);
}

/**
 * Actualiza el valor de la distancia global y notifica el cambio a los observadores.
 *
 * @param {number} distance - Distancia calculada en metros hasta el objetivo.
 */
export function updateGlobalDistance(distance) {
    currentDistance = distance;
    onDistanceObservable.notifyObservers(distance);
}