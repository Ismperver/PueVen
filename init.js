// Imports necesarios 
import { useEngine } from '@babylonjs/react-native';
import { useEffect, useState } from 'react';
import { createScene } from './src/index';
import fs from "react-native-fs";
import { Buffer } from "buffer";

/**
 * Custom hook para crear y manejar una escena de Babylon Native en React Native.
 * Se encarga de:
 *  - Esperar a que el engine esté inicializado.
 *  - Cargar una fuente TTF desde los assets del proyecto.
 *  - Inicializar la escena con `createScene`.
 *  - Retornar la escena y la cámara activa para que otros componentes puedan usarla.
 *
 * @returns {Object} - { scene, camera }
 *   - scene: instancia de BABYLON.Scene creada.
 *   - camera: cámara activa de la escena.
 */
export const usePlaygroundScene = () => {
  const engine = useEngine(); 
  // Función Hook que retorna la instancia del engine de Babylon Native
  const [scene, setScene] = useState(); 
  const [camera, setCamera] = useState(); 

  /**
   * Función para cargar una fuente TTF desde los assets de Android y registrarla en Babylon Native
   */
  async function loadTTF() {
    
    /**
     * Convierte una cadena Base64 en ArrayBuffer.
     * Necesario porque Babylon Native requiere ArrayBuffer para cargar fuentes TTF.
     * @param {string} base64 - Contenido de la fuente codificado en base64
     * @returns {ArrayBuffer} - ArrayBuffer de la fuente
     */
    const base64ToArrayBuffer = async (base64) => {
      const binary = Buffer.from(base64, "base64");
      return binary.buffer.slice(
        binary.byteOffset,
        binary.byteOffset + binary.byteLength
      );
    };

    // Lee el archivo TTF desde la carpeta assets/fonts de Android
    await fs.readFileAssets("fonts/droidsans.ttf", "base64")
      .then(async base64 => {
        const miFuente = await base64ToArrayBuffer(base64);
        console.log("Archivo cargado", miFuente);

        // En Babylon Native, la API nativa (_native.Canvas) permite registrar la fuente
        // Esto es necesario porque la versión React Native de Babylon no carga fuentes desde assets directamente
        _native.Canvas.loadTTFAsync("Arial", miFuente);
      })
      .catch(console.error)
  }

  /**
   * useEffect principal:
   * Espera a que el engine esté disponible:
   * - Carga la fuente TTF.
   * - Crea la escena usando `createScene`.
   * - Guarda la escena y la cámara activa en el estado.
   */
  useEffect(() => {
    if (!engine) return;

    const timeout = setTimeout(() => {
      loadTTF().then(() => {
        const scene = createScene(engine);
        setScene(scene);
        setCamera(scene.activeCamera);
      });
    }, 500); // Pequeño delay para asegurar que el engine y el contexto nativo están listos.

    return () => clearTimeout(timeout); // Limpia el timeout.
    }, [engine]);

  return { scene, camera }; 
};
