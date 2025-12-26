/**
 * Módulo de asistencia para la lógica de negocio del selector de tiendas.
 * Proporciona funciones de filtrado, búsqueda y gestión de datos del directorio.
 */

/**
 * Filtra una lista de tiendas basándose en un término de búsqueda.
 * * @param {Array<Object>} stores - Lista completa de tiendas desde el origen de datos.
 * @param {string} searchTerm - Texto ingresado por el usuario.
 * @returns {Array<Object>} Lista de tiendas que coinciden con el nombre.
 */
export function filterStore(stores, searchTerm) {
    if (!searchTerm) return stores;

    const term = searchTerm.toLowerCase().trim();
    return stores.filter(store =>
        store.nombre.toLowerCase().includes(term)
    );
}

/**
 * Obtiene todas las tiendas que pertenecen a una categoría específica.
 * Utiliza las categorías del JSON.
 * * @param {Array<Object>} stores - Lista completa de tiendas.
 * @param {string} category - Categoría seleccionada para filtrar.
 * @returns {Array<Object>} Lista de tiendas pertenecientes a dicha categoría.
 */
export function getStoresByCategory(stores, category) {
    if (!category || category === "Todas") return stores;

    return stores.filter(store => store.categoria === category);
}

/**
 * Realiza una búsqueda aproximada para tolerar errores de escritura.
 * Optimiza la experiencia de usuario reduciendo la frustración al buscar nombres.
 * * @param {Array<Object>} stores - Lista completa de tiendas.
 * @param {string} query - Texto de búsqueda con posibles errores ortográficos.
 * @returns {Array<Object>} Resultados sugeridos según la coincidencia.
 */
export function fuzzSearch(stores, query) {
    if (!query || query.length < 2) return [];

    const term = query.toLowerCase().trim();

    // Lógica de búsqueda simple por coincidencia.
    return stores.filter(store => {
        const name = store.nombre.toLowerCase();
        return name.startsWith(term) || name.includes(term);
    }).sort((storeA, storeB) => {
        // Priorizar resultados que empiezan con el término de búsqueda.
        const storeAStarts = storeA.nombre.toLowerCase().startsWith(term);
        const storeBStarts = storeB.nombre.toLowerCase().startsWith(term);
        return storeAStarts === storeBStarts ? 0 : storeAStarts ? -1 : 1;
    });
}
