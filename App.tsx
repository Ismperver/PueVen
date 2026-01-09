import React, { useState, useEffect } from 'react';
import 'text-encoding-polyfill';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { EngineView } from '@babylonjs/react-native';
import { Scene, Camera } from '@babylonjs/core';

import { usePlaygroundScene } from './init.js';
import { initSelectorScreen, focusStore, renderStoreTargets } from './src/modules/selectorScreen/selectorScreen.js';
import { switchFloor } from './src/modules/selectorScreen/mapView.js';
import tiendasData from './src/assets/dataSet/tiendas.json';

// Importación de componentes de UI
import { SearchBar } from './src/modules/selectorScreen/searchBar.js';
import { StorePanel } from './src/modules/selectorScreen/storePanel.js';
import { NeonButton } from './src/components/Button.js';

// Importación de la lógica de Realidad Aumentada
import { startARScreen } from './src/modules/arScreen/arScreen.js';

/**
 * Interfaz de la estructura de datos de una tienda.
 * @interface Tienda
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
 * Componente principal de la aplicación.
 * Gestiona la sincronización entre el estado de React y la escena de Babylon,
 * controlando la transición entre el modo mapa y el guiado AR.
 * @returns {JSX.Element}
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

  /** * Estado para controlar la visibilidad de la interfaz de usuario de React 
   * durante la sesión de Realidad Aumentada.
   */
  const [isARActive, setIsARActive] = useState(false);

  /**
   * Extrae las categorías únicas del JSON para el filtro de la SearchBar.
   */
  const categories = Array.from(new Set(tiendasData.tiendas.map(t => t.categoria)));

  /**
   * Inicialización de la escena una vez que el motor está listo.
   * Configura el selector inicial y activa la visibilidad de la UI tras el splash.
   */
  useEffect(() => {
    if (scene) {
      initSelectorScreen(scene, (store: Tienda) => setSelectedStore(store));
      const timer = setTimeout(() => setShowUI(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  /**
   * Filtra las tiendas basándose en el término de búsqueda y la categoría seleccionada.
   * @param {string} text - Texto de entrada del buscador.
   * @param {string} category - Categoría seleccionada para filtrar los resultados.
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
   * Cambia el nivel del mapa y actualiza los marcadores visibles en la escena 3D.
   * @param {number} floor - Planta seleccionada (0 para Planta Baja, 1 para Primera).
   */
  const handleFloorChange = (floor: number) => {
    if (scene && typeof scene.getMeshByName === 'function') {
      switchFloor(scene, floor);
      renderStoreTargets(scene, floor, (store: Tienda) => setSelectedStore(store));
      setCurrentFloor(floor);
      setSelectedStore(null);
    }
  };

  /**
   * Activa la sesión de Realidad Aumentada para la tienda seleccionada.
   * Oculta la UI de React para permitir la visualización inmersiva.
   * @param {Tienda} store - Objeto de la tienda destino.
   */
  const handleStartAR = async (store: Tienda) => {
    if (scene) {
      setIsARActive(true);
      await startARScreen(scene, store, () => {
        setIsARActive(false);
        setSelectedStore(null);
        initSelectorScreen(scene, (s) => setSelectedStore(s));
        renderStoreTargets(scene, currentFloor, (s) => setSelectedStore(s));
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>
        <EngineView camera={camera} displayFrameRate={false} />

        {/* Renderizado condicional de la UI: Solo visible si no estamos en modo AR activo */}
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
    </SafeAreaView>
  );
};

/**
 * Estilos para los contenedores de la interfaz nativa.
 */
const styles = StyleSheet.create({
  floorButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  }
});

export default App;