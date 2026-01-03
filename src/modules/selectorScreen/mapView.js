import { MeshBuilder, StandardMaterial, Texture, Vector3, Color3 } from "@babylonjs/core";
import { Image } from "react-native";
import mapFloor0 from "../../assets/maps/pv_planta_baja.png";
import mapFloor1 from "../../assets/maps/pv_primera_planta.png";

/**
 * Crea el mapa interactivo de Puerto Venecia con soporte para varias plantas.
 * * Configura el plano del suelo con la textura correspondiente a la planta seleccionada
 * y aplica un estilo visual neón coherente con el resto de la aplicación.
 *
 * @param {Scene} scene - La escena de Babylon donde se colocará el mapa.
 * @param {Object} options - Configuración para personalizar el mapa.
 * @param {number} [options.floor=0] - Nivel de la planta (0 para Planta Baja, 1 para Primera Planta).
 * @param {number} [options.sizeW=60] - Ancho del plano basado en la cuadrícula del PDF.
 * @param {number} [options.sizeH=100] - Alto del plano basado en la cuadrícula del PDF.
 * @returns {Mesh} Devuelve el plano del mapa creado.
 */
export function createMapView(scene, options = {}) {
    console.log("carga createMapView");
    const {
        floor = 0,
        sizeW = 60,
        sizeH = 100
    } = options;

    // Selección de imagen según el PDF (Galería Planta Baja o Primera Planta)
    // Selección de imagen según el PDF (Galería Planta Baja o Primera Planta)
    const mapAsset = floor === 0
        ? mapFloor0
        : mapFloor1;

    const resolvedMap = Image.resolveAssetSource(mapAsset);

    // Crear el plano (suelo) con las proporciones de la galería
    const ground = MeshBuilder.CreateGround("groundMap", { width: sizeW, height: sizeH }, scene);

    // Configurar material
    const mapMaterial = new StandardMaterial("mapMaterial", scene);
    mapMaterial.diffuseTexture = new Texture(resolvedMap.uri, scene);

    // Hacemos que el mapa sea auto-iluminado
    mapMaterial.emissiveTexture = mapMaterial.diffuseTexture;
    mapMaterial.specularColor = new Color3(0, 0, 0); // Evitar reflejos molestos
    mapMaterial.backFaceCulling = false; // Visible desde ambos lados si es necesario

    ground.material = mapMaterial;

    // Posicionamos el mapa. Si es la planta 1, lo subimos ligeramente en el eje Y
    ground.position = new Vector3(0, floor * 0.5, 0);

    console.log(`Mapa de Puerto Venecia: Planta ${floor === 0 ? "Baja" : "Primera"} cargada.`);

    return ground;
}

/**
 * Cambia la planta actual del mapa destruyendo la anterior y creando la nueva.
 * * @param {Mesh} currentMap - El objeto del mapa que está actualmente en pantalla.
 * @param {number} newFloor - El número de la nueva planta a cargar.
 * @param {Scene} scene - La escena activa.
 * @returns {Mesh} El nuevo mapa creado.
 */
export function switchFloor(currentMap, newFloor, scene) {
    if (currentMap) {
        disposeMap(currentMap);
    }
    return createMapView(scene, { floor: newFloor });
}

/**
 * Ajusta la cámara para tener una visión perfecta del mapa desde arriba.
 * * @param {Camera} camera - La cámara (Universal o ArcRotate) que queremos mover.
 * @param {number} [height=80] - Altura desde la que queremos ver el mapa.
 */
export function focusMap(camera, height = 80) {
    if (camera) {
        camera.position = new Vector3(0, height, 0);
        camera.setTarget(Vector3.Zero());
    }
}

/**
 * Elimina el mapa de la memoria y limpia sus texturas.
 * * Es fundamental para el rendimiento en dispositivos móviles (Babylon Native)
 * para evitar que las imágenes de gran tamaño saturen la RAM.
 * * @param {Mesh} ground - El plano del mapa que se desea eliminar.
 */
export function disposeMap(ground) {
    if (ground) {
        if (ground.material) {
            if (ground.material.diffuseTexture) {
                ground.material.diffuseTexture.dispose();
            }
            ground.material.dispose();
        }
        ground.dispose();
        console.log("Recursos del mapa liberados.");
    }
}