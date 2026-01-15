# Arquitectura del Sistema

Esta sección describirá la arquitectura de PueVen Navigator.

## Visión General

**PueVen Navigator** es una aplicación móvil híbrida que combina la potencia de **React Native** para la interfaz de usuario e interacción nativa, con **Babylon.js** para el renderizado de gráficos 3D y experiencias de Realidad Aumentada (AR).

Esta arquitectura permite una navegación fluida dentro del centro comercial, ofreciendo mapas interactivos en 3D y guiado visual mediante cámara.

## Módulos Principales

La aplicación se estructura en varios módulos clave ubicados en `src/modules`:

### 1. Core (`App.tsx`)
El punto de entrada de la aplicación. Gestiona:
- **Estado Global**: Controla la tienda seleccionada, la planta actual y el modo de visualización (Mapa vs AR).
- **Inicialización**: Configura el motor de Babylon Native y la escena 3D.
- **Interfaz Híbrida**: Superpone componentes de React Native (`SearchBar`, `StorePanel`) sobre la vista 3D (`EngineView`).

### 2. Selector Screen (`src/modules/selectorScreen`)
Encargado de la vista del mapa interactivo.
- **`selectorScreen.js`**: Lógica para seleccionar tiendas al tocar objetos 3D.
- **`mapView.js`**: Gestión de cambios de planta y visibilidad de mallas.
- **`target.js`**: Renderizado de marcadores flotantes sobre las tiendas.
- **`searchBar.js`**: Componente de búsqueda y filtrado de tiendas.

### 3. AR Screen (`src/modules/arScreen`)
Gestiona la experiencia de Realidad Aumentada.
- **`arScreen.js`**: Configura la cámara web y el seguimiento de posición.
- **`arScene.js`**: Maneja la escena específica de AR, superponiendo flechas o indicadores de dirección hacia el destino.

### 4. Componentes Reutilizables (`src/components`)
Elementos de UI compartidos, diseñados con estilos "Neón" para encajar con la estética futurista.
- **`Button.js`**: Botones con efectos de brillo.
- **`Panel.js`**: Contenedores para información de tiendas.

## Flujo de Datos

1. **Carga**: La app inicia cargando `tiendas.json`, que contiene la "base de datos" de tiendas, ubicaciones y metadatos.
2. **Visualización**: Se renderiza el mapa 3D. El usuario interactúa tocando tiendas o usando el buscador.
3. **Selección**: Al seleccionar una tienda, se actualiza el estado global y se muestra el `StorePanel`.
4. **Navegación AR**: Si el usuario pulsa "Ir a tienda", se pausa la escena del mapa, se activa la cámara y se inicia `arScreen`.
5. **Guiado**: El sistema calcula la dirección relativa y muestra indicadores 3D sobre la imagen de cámara.
