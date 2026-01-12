/**
 * Módulo de formato de texto.
 * Proporciona funciones para escalar y estandarizar el tamaño del texto en la interfaz gráfica.
 * Se utiliza el escalado de transformación (scaleX/scaleY) como workaround para optimizar
 * la renderización de texto en Babylon Native en dispositivos móviles.
 */

/**
 * Aplica una transformación de escala para textos de tipo Título.
 * Aumenta significativamente el tamaño visual sin alterar el fontSize base.
 *
 * @param {TextBlock} text - Instancia del control TextBlock a modificar.
 */
export function titleText(text) {
    text.scaleX = 10;
    text.scaleY = 10;
}

/**
 * Aplica una transformación de escala para textos de tipo Subtítulo.
 *
 * @param {TextBlock} text - Instancia del control TextBlock a modificar.
 */
export function subtitleText(text) {
    text.scaleX = 5;
    text.scaleY = 5;
}

/**
 * Aplica una transformación de escala para textos de cuerpo resaltado (grande).
 *
 * @param {TextBlock} text - Instancia del control TextBlock a modificar.
 */
export function bigNormalText(text) {
    text.scaleX = 3;
    text.scaleY = 3;
}

/**
 * Aplica una transformación de escala para textos de cuerpo normal.
 * Asegura la legibilidad mínima en pantallas de alta densidad de píxeles.
 *
 * @param {TextBlock} text - Instancia del control TextBlock a modificar.
 */
export function normalText(text) {
    text.scaleX = 1.5;
    text.scaleY = 1.5;
}
