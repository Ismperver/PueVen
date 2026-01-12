import React, { useState, useEffect } from 'react';
import 'text-encoding-polyfill';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { EngineView } from '@babylonjs/react-native';
import { Scene, Camera } from '@babylonjs/core';

import { usePlaygroundScene } from './init.js';
import { initSelectorScreen, focusStore, renderStoreTargets, setSelectionCallback } from './src/modules/selectorScreen/selectorScreen.js';
import { switchFloor } from './src/modules/selectorScreen/mapView.js';
import tiendasData from './src/assets/dataSet/tiendas.json';

import { SearchBar } from './src/modules/selectorScreen/searchBar.js';
import { StorePanel } from './src/modules/selectorScreen/storePanel.js';
import { NeonButton } from './src/components/Button.js';

import { startARScreen } from './src/modules/arScreen/arScreen.js';

/**
 * Define la estructura de datos de una tienda.
 * @interface Tienda
 * @property {number} id - Identificador único de la tienda.
 * @property {string} nombre - Nombre comercial de la tienda.
 * @property {string} categoria - Categoría a la que pertenece (Moda, Restauración, etc.).
 * @property {number} planta - Número de planta donde se ubica (0 o 1).
 * @property {string} coordenadas - Coordenadas de ubicación en el mapa.
 * @property {string} descripcion - Descripción detallada de la tienda.
 * @property {string} logo - Ruta o nombre del archivo del logotipo.
 */
interface Tienda {
  id: number;
  nombre: string;
  categoria: string;
  planta: number;
  coordenadas: string;
  descripcion: string;
  logo: string;
}

/**
 * Componente raíz de la aplicación.
 * Gestiona el ciclo de vida de la escena de Babylon, la sincronización entre el estado de React y el motor 3D,
 * y orquesta la transición entre la vista de selección (mapa) y la vista de Realidad Aumentada.
 *
 * @returns {JSX.Element} Elemento JSX que contiene la vista del motor 3D y la capa de interfaz de usuario.
 */
const App = () => {
  const { scene, camera } = usePlaygroundScene() as { scene: Scene; camera: Camera };

  // Estados de búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState<Tienda[]>([]);

  // Estados de navegación y UI
  const [currentFloor, setCurrentFloor] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Tienda | null>(null);

  /** 
   * Controla la visibilidad de la interfaz de usuario de React durante la sesión de Realidad Aumentada.
   */
  const [isARActive, setIsARActive] = useState(false);

  /**
   * Obtiene un arreglo de categorías únicas derivadas del conjunto de datos de tiendas.
   */
  const categories = Array.from(new Set(tiendasData.tiendas.map(t => t.categoria)));

  /**
   * Inicializa la lógica del selector una vez que la escena de Babylon está lista.
   * Configura el callback de selección y habilita la visibilidad de la interfaz tras un tiempo de espera inicial.
   */
  useEffect(() => {
    if (scene) {
      setSelectionCallback((store: Tienda) => setSelectedStore(store));
      initSelectorScreen(scene);
      const timer = setTimeout(() => {
        setShowUI(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  /**
   * Actualiza los resultados de búsqueda en función del texto ingresado y la categoría seleccionada.
   *
   * @param {string} text - Texto a buscar en los nombres de las tiendas.
   * @param {string} [category=selectedCategory] - Categoría para filtrar los resultados.
   */
  const handleSearch = (text: string, category: string = selectedCategory) => {
    setSearchTerm(text);

    if (text.length > 1 || category !== '') {
      const filtered = (tiendasData.tiendas as Tienda[]).filter(t => {
        const matchText = t.nombre.toLowerCase().includes(text.toLowerCase());
        const matchCategory = category === '' || t.categoria === category;
        return matchText && matchCategory;
      });
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  /**
   * Gestiona el cambio de planta visualizada en el mapa 3D.
   * Actualiza el estado local y solicita a la escena que renderice los marcadores correspondientes a la nueva planta.
   *
   * @param {number} floor - Índice de la planta a visualizar (0 para baja, 1 para primera).
   */
  const handleFloorChange = (floor: number) => {
    if (scene && typeof scene.getMeshByName === 'function') {
      switchFloor(scene, floor);
      renderStoreTargets(scene, floor);
      setCurrentFloor(floor);
      setSelectedStore(null);
    }
  };

  /**
   * Inicia la experiencia de Realidad Aumentada dirigida a una tienda específica.
   * Oculta la interfaz de usuario superpuesta y delega el control al módulo de AR.
   * Al finalizar la sesión AR, restaura el estado de la aplicación.
   *
   * @param {Tienda} store - Tienda objetivo para la navegación en AR.
   */
  const handleStartAR = async (store: Tienda) => {
    if (scene) {
      setIsARActive(true);
      await startARScreen(scene, store, () => {
        setIsARActive(false);
        setSelectedStore(null);
        initSelectorScreen(scene);
        renderStoreTargets(scene, currentFloor);
      });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <EngineView
        camera={camera}
        displayFrameRate={false}
        isTransparent={true}
        androidView="SurfaceViewZMediaOverlay"
        style={styles.engineView}
      />

      <View style={styles.uiOverlay} pointerEvents="box-none">
        {showUI && !isARActive && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              onSearch={(text: string) => handleSearch(text, selectedCategory)}
              results={results}
              categories={categories}
              onCategorySelect={(cat: string) => {
                setSelectedCategory(cat);
                handleSearch(searchTerm, cat);
              }}
              onSelect={(store: Tienda) => {
                if (store.planta !== currentFloor) handleFloorChange(store.planta);
                focusStore(scene, store);
                setSelectedStore(store);
                setResults([]);
                setSearchTerm('');
              }}
            />

            <StorePanel
              store={selectedStore}
              onClose={() => setSelectedStore(null)}
              onStartAR={handleStartAR}
            />

            <View style={styles.floorButtonsContainer}>
              <NeonButton
                text="PLANTA BAJA"
                onPress={() => handleFloorChange(0)}
                active={currentFloor === 0}
              />
              <NeonButton
                text="1ª PLANTA"
                onPress={() => handleFloorChange(1)}
                active={currentFloor === 1}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

/**
 * Define los estilos de los componentes nativos de la interfaz.
 */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  engineView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    elevation: 10,
  },
  floorButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  }
});

export default App;