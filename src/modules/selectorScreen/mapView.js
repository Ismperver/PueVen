import { MeshBuilder, StandardMaterial, Texture, Vector3, Color3 } from "@babylonjs/core";
import { Image } from "react-native";
import mapFloor0 from "../../assets/maps/pv_planta_baja.png";
import mapFloor1 from "../../assets/maps/pv_primera_planta.png";

/** @const {Object} MAP_SIZE - Dimensiones del plano del mapa basadas en el diseño del PDF. */
const MAP_SIZE = { width: 60, height: 100 };

/**
 * Crea o actualiza el plano del mapa en la escena de Babylon de forma segura.
 * @param {import("@babylonjs/core").Scene} scene - La escena activa.
 * @param {number} [floor=0] - El nivel de la planta.
 * @returns {import("@babylonjs/core").Mesh|null} El plano del mapa creado.
 */
export function createMapView(scene, floor = 0) {
    if (!scene || scene.isDisposed) return null;

    const mapName = "groundMap";
    const existingMap = scene.getMeshByName(mapName);

    // Limpieza segura de recursos previos para evitar error clearRect
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

    // Carga de textura optimizada para Babylon Native
    material.diffuseTexture = new Texture(resolved.uri, scene, {
        noMipmap: true,
        onLoad: () => console.log(`Mapa planta ${floor} renderizado.`)
    });

    material.specularColor = new Color3(0, 0, 0);
    ground.material = material;

    return ground;
}

/**
 * Cambia la planta actual del mapa.
 * @param {import("@babylonjs/core").Scene} scene 
 * @param {number} floorNumber 
 */
export function switchFloor(scene, floorNumber) {
    return createMapView(scene, floorNumber);
}

/**
 * Ajusta la cámara para una vista cenital del centro comercial.
 * @param {import("@babylonjs/core").ArcRotateCamera} camera 
 */
export function focusMap(camera) {
    if (!camera) return;
    camera.setTarget(Vector3.Zero());
    camera.radius = 80;
    camera.alpha = -Math.PI / 2;
    camera.beta = Math.PI / 4;
}

/**
 * Lógica de coordenadas calibrada según la rejilla del PDF.
 * @param {string} code - Código alfanumérico (ej: "G5" o "D11").
 * @param {number} floor - Planta para determinar la escala horizontal.
 * @returns {import("@babylonjs/core").Vector3}
 */
export function getCoordinates(code, floor = 0) {
    if (!code) return new Vector3(0, 0, 0);

    const columnChar = code.charAt(0).toUpperCase(); // Letras A-J
    const row = parseInt(code.slice(1), 10);        // Números
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
 * Pre-carga las texturas de los mapas.
 */
export function loadMapAssets(scene) {
    return Promise.all([
        new Promise(res => new Texture(Image.resolveAssetSource(mapFloor0).uri, scene, { onLoad: res })),
        new Promise(res => new Texture(Image.resolveAssetSource(mapFloor1).uri, scene, { onLoad: res }))
    ]);
}