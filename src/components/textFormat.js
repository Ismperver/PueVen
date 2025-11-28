
/**
 * Aplica escala adicional al título en dispositivos móviles estando
 * totalmente modularizado para poder cambiar los tamaños e un mismo
 * lugar.
 * 
 * @param {TextBlock} title - Instancia de TextBlock (Babylon GUI)
 * 
 * @description
 * Usa `scaleX/scaleY` en lugar de aumentar `fontSize` ya que
 * en Babylon Native existe un bug para el texto y es la única forma
 * de poder gestionar el tamaño de las fuentes, para:
 * 
 * - Evitar redibujado pesado en Babylon Native
 * - Mantener legibilidad en pantallas de alta densidad
 * - Control fino sobre el tamaño percibido
 */
export function titleText(text) {
    text.scaleX = 10;
    text.scaleY = 10;
}

// Función que aplica escala para los subtitulos.
export function subtitleText(text) {
    text.scaleX = 5;
    text.scaleY = 5;
}

// Función que aplica escala para los textos normales
// pero un poco más grandes.
export function bigNormalText(text) {
    text.scaleX = 3;
    text.scaleY = 3;
}

// Función que aplica la escala para los textos ya que en 1
// en pantallas de dispositivos móviles se ve pequeño.
export function normalText(text) {
    text.scaleX = 1.5;
    text.scaleY = 1.5;
}

