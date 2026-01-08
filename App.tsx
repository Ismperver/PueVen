import React, { useState, useEffect } from 'react';
import 'text-encoding-polyfill';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { EngineView } from '@babylonjs/react-native';
import { Scene, Camera } from '@babylonjs/core';

import { usePlaygroundScene } from './init.js';
import { initSelectorScreen, focusStore, renderStoreTargets } from './src/modules/selectorScreen/selectorScreen.js';
import { switchFloor } from './src/modules/selectorScreen/mapView.js';
import tiendasData from './src/assets/dataSet/tiendas.json';

import { SearchBar } from './src/modules/selectorScreen/searchBar.js';
import { StorePanel } from './src/modules/selectorScreen/storePanel.js';
import { NeonButton } from './src/components/Button.js';

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
 * Componente principal de la aplicación PueVen Navigator.
 * Gestiona la sincronización entre el estado de React y la escena de Babylon.
 * @returns {JSX.Element}
 */
const App = () => {
  const { scene, camera } = usePlaygroundScene() as { scene: Scene; camera: Camera };
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Tienda[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Tienda | null>(null);

  /**
   * Inicialización de la escena una vez que el motor está listo.
   */
  useEffect(() => {
    if (scene) {
      initSelectorScreen(scene, (store: Tienda) => setSelectedStore(store));
      const timer = setTimeout(() => setShowUI(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  /**
   * Filtra las tiendas basándose en el término de búsqueda.
   * @param {string} text - Texto de entrada.
   */
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text.length > 1) {
      const filtered = (tiendasData.tiendas as Tienda[]).filter(t =>
        t.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  /**
   * Cambia el nivel del mapa y actualiza los marcadores visibles.
   * @param {number} floor - Planta seleccionada (0 o 1).
   */
  const handleFloorChange = (floor: number) => {
    if (scene && typeof scene.getMeshByName === 'function') {
      switchFloor(scene, floor);
      // ACTUALIZACIÓN DE TARGETS: Clave para que cambien con el mapa
      renderStoreTargets(scene, floor, (store: Tienda) => setSelectedStore(store));
      setCurrentFloor(floor);
      setSelectedStore(null); // Limpiar panel al cambiar planta
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>
        <EngineView camera={camera} displayFrameRate={false} />

        {showUI && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              onSearch={handleSearch}
              results={results}
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
              onStartAR={(store: Tienda) => console.log("Abriendo sesión AR para:", store.nombre)}
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