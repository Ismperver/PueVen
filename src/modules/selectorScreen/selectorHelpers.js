/**
 * Módulo de asistencia para la lógica de negocio del selector de tiendas.
 * Proporciona funciones especializadas para filtrar, categorizar y buscar datos dentro del directorio de tiendas.
 */

/**
 * Filtra un arreglo de tiendas basándose en la coincidencia parcial del nombre.
 * Realiza una comparación insensible a mayúsculas y minúsculas y elimina espacios innecesarios.
 *
 * @param {Array<Object>} stores - Lista completa de tiendas origen.
 * @param {string} searchTerm - Cadena de texto utilizada como criterio de búsqueda.
 * @returns {Array<Object>} Nuevo arreglo conteniendo únicamente las tiendas que cumplen el criterio.
 */
export function filterStore(stores, searchTerm) {
    if (!searchTerm) return stores;

    const term = searchTerm.toLowerCase().trim();
    return stores.filter(store =>
        store.nombre.toLowerCase().includes(term)
    );
}

/**
 * Obtiene un subconjunto de tiendas que pertenecen a una categoría específica.
 *
 * @param {Array<Object>} stores - Lista completa de tiendas.
 * @param {string} category - Nombre de la categoría a filtrar (ej. 'Moda', 'Restauración'). Si se proporciona 'Todas' o null, retorna la lista completa.
 * @returns {Array<Object>} Arreglo de tiendas filtradas por la categoría indicada.
 */
export function getStoresByCategory(stores, category) {
    if (!category || category === "Todas") return stores;

    return stores.filter(store => store.categoria === category);
}

/**
 * Ejecuta una búsqueda heurística para encontrar coincidencias relevantes, tolerando imprecisiones.
 * Prioriza los resultados que comienzan exactamente con el término de búsqueda sobre los que simplemente lo contienen.
 *
 * @param {Array<Object>} stores - Lista completa de tiendas.
 * @param {string} query - Texto de consulta ingresado por el usuario.
 * @returns {Array<Object>} Lista ordenada de resultados sugeridos, de mayor a menor relevancia.
 */
export function fuzzSearch(stores, query) {
    if (!query || query.length < 2) return [];

    const term = query.toLowerCase().trim();

    return stores.filter(store => {
        const name = store.nombre.toLowerCase();
        return name.startsWith(term) || name.includes(term);
    }).sort((storeA, storeB) => {
        const storeAStarts = storeA.nombre.toLowerCase().startsWith(term);
        const storeBStarts = storeB.nombre.toLowerCase().startsWith(term);
        return storeAStarts === storeBStarts ? 0 : storeAStarts ? -1 : 1;
    });
}
