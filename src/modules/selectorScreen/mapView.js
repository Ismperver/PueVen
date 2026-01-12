import { MeshBuilder, StandardMaterial, Texture, Vector3, Color3 } from "@babylonjs/core";
import { Image } from "react-native";
import mapFloor0 from "../../assets/maps/pv_planta_baja.png";
import mapFloor1 from "../../assets/maps/pv_primera_planta.png";

/** @const {Object} MAP_SIZE - Dimensiones físicas del plano del mapa definidas según el diseño original en PDF. */
const MAP_SIZE = { width: 60, height: 100 };

/**
 * Genera o actualiza el plano del mapa dentro de la escena de Babylon.js.
 * Gestiona la creación de la geometría y la aplicación del material con la textura correspondiente a la planta seleccionada.
 * Realiza una limpieza de recursos previos para asegurar un rendimiento óptimo al cambiar de nivel.
 *
 * @param {import("@babylonjs/core").Scene} scene - La escena activa donde se renderizará el mapa.
 * @param {number} [floor=0] - Índice de la planta a visualizar (0 para baja, 1 para primera).
 * @returns {import("@babylonjs/core").Mesh|null} La malla (Mesh) del suelo creada, o null si la escena no es válida.
 */
export function createMapView(scene, floor = 0) {
    if (!scene || scene.isDisposed) return null;

    const mapName = "groundMap";
    const existingMap = scene.getMeshByName(mapName);

    if (existingMap) {
        if (existingMap.material) existingMap.material.dispose();
        existingMap.dispose();
    }

    const ground = MeshBuilder.CreateGround(mapName, {
        width: MAP_SIZE.width,
        height: MAP_SIZE.height
    }, scene);

    const material = new StandardMaterial("mapMaterial", scene);
    const mapAsset = floor === 1 ? mapFloor1 : mapFloor0;
    const resolved = Image.resolveAssetSource(mapAsset);

    material.diffuseTexture = new Texture(resolved.uri, scene, {
        noMipmap: true,
        onLoad: () => console.log(`Mapa planta ${floor} renderizado.`)
    });

    material.specularColor = new Color3(0, 0, 0);
    ground.material = material;

    return ground;
}

/**
 * Gestiona la transición visual entre las diferentes plantas del edificio.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @param {number} floorNumber - Número de planta destino.
 * @returns {import("@babylonjs/core").Mesh|null} El nuevo mapa renderizado.
 */
export function switchFloor(scene, floorNumber) {
    return createMapView(scene, floorNumber);
}

/**
 * Reubica y orienta la cámara para ofrecer una vista cenital del mapa.
 * Configura los parámetros de radio y ángulos para optimizar la visualización de la planta completa.
 *
 * @param {import("@babylonjs/core").ArcRotateCamera} camera - Cámara orbital a ajustar.
 */
export function focusMap(camera) {
    if (!camera) return;
    camera.setTarget(Vector3.Zero());
    camera.radius = 80;
    camera.alpha = -Math.PI / 2;
    camera.beta = Math.PI / 4;
}

/**
 * Transforma una referencia de coordenadas alfanumérica (sistema de grilla del PDF) a un vector de posición en el espacio 3D.
 *
 * @param {string} code - Código de ubicación (ej: "G5" o "D11").
 * @param {number} floor - Planta actual, necesaria para determinar el desplazamiento en el eje X.
 * @returns {import("@babylonjs/core").Vector3} Vector3 con la posición calculada en el mundo virtual.
 */
export function getCoordinates(code, floor = 0) {
    if (!code) return new Vector3(0, 0, 0);

    const columnChar = code.charAt(0).toUpperCase();
    const row = parseInt(code.slice(1), 10);
    const columns = "ABCDEFGHIJ";
    const colIndex = columns.indexOf(columnChar);

    if (colIndex === -1) return new Vector3(0, 0, 0);

    // Eje X (Horizontal): Planta 0 usa 7-12, Planta 1 usa 1-6.
    const startRow = floor === 0 ? 7 : 1;
    const x = -30 + (row - startRow) * (60 / 5);

    // Eje Z (Vertical): Letras A-J de abajo hacia arriba.
    const z = -50 + colIndex * (100 / 9);

    return new Vector3(x, 0, z);
}

/**
 * Inicia la carga asíncrona de las texturas de los mapas para optimizar el rendimiento.
 *
 * @param {import("@babylonjs/core").Scene} scene - Escena activa.
 * @returns {Promise} Promesa que se resuelve cuando todas las texturas han sido cargadas.
 */
export function loadMapAssets(scene) {
    return Promise.all([
        new Promise(res => new Texture(Image.resolveAssetSource(mapFloor0).uri, scene, { onLoad: res })),
        new Promise(res => new Texture(Image.resolveAssetSource(mapFloor1).uri, scene, { onLoad: res }))
    ]);
}