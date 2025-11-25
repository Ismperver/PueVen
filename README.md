# PueVen Navigator

Este es un proyecto de **React Native** utilizando **Babylon Native** para renderizado 3D y AR en dispositivos móviles.  

La configuración original para funcionar ha sido adquirida desde otro repositorio con la configuración inicial praparado para funcionar con las tecnologias anteriormente citadas:
```bash
https://github.com/emendez-virtuallife/fct-app.git
```

## Clonar el repositorio

Clona este repositorio en tu máquina:

```bash
# Clonar la rama principal directamente en la carpeta actual
git clone --branch main https://github.com/Ismperver/PueVen_Navigator.git .
```
Nota: el . al final indica que los archivos se colocan directamente en tu carpeta raíz, sin crear una subcarpeta adicional.

# Estructura del proyecto
```text
PueVen_Navigator/
│
├─ .tests/               # Carpeta personalizada de pruebas (posiblemente __tests__ renombrada)
├─ .bundle/              # Salida del bundler Metro (generada en ejecución)
├─ .vitepress/           # Configuración de VitePress (documentación del proyecto)
├─ android/              # Proyecto Android nativo (React Native puro)
├─ ios/                  # Proyecto iOS nativo (React Native puro)
├─ docs/                 # Documentación del proyecto escrita con VitePress
├─ node_modules/         # Dependencias de Node.js
├─ src/                  # Código fuente principal de la aplicación
├─ eslintrc.js       # Configuración de ESLint
├─ .gitignore
├─ .prettierrc.js        # Configuración de Prettier
├─ .watchmanconfig       # Configuración de Watchman (usado por React Native)
├─ app.json              # Configuración de Expo Managed (o React Native CLI personalizado)
├─ App.tsx               # Punto de entrada principal de la app (React Native + TSX)
├─ babel.config.js       # Configuración de Babel
├─ Gemfile               # Dependencias Ruby (Fastlane / CocoaPods en iOS)
├─ index.js              # Entry point clásico de React Native
├─ init.js               # Script personalizado de inicialización
├─ jest.config.js        # Configuración de pruebas con Jest
├─ metro.config.js       # Configuración personalizada del bundler Metro
├─ package-lock.json
├─ package.json          # Dependencias y scripts (incluye @babylonjs/core, etc.)
├─ README.md
└─ tsconfig.json         # Configuración de TypeScript
```
## Dependencias principales

Estas dependencias son necesarias para que el proyecto funcione correctamente:

React Native + Babylon Native
```json
"dependencies": {
  "react": "18.2.0",
  "react-native": "0.73.0",
  "@babylonjs/core": "^7.37.0",
  "@babylonjs/gui": "^7.37.0",
  "@babylonjs/loaders": "^7.37.0",
  "@babylonjs/react-native": "^1.8.5",
  "text-encoding-polyfill": "^0.6.7"
}
```

## DevDependencies
```json
"devDependencies": {
  "@babel/core": "^7.20.0",
  "@babel/preset-env": "^7.20.0",
  "@react-native/babel-preset": "^0.73.18",
  "typescript": "5.0.4",
  "eslint": "^8.19.0",
  "jest": "^29.6.3"
}
```
Nota: los módulos de Node no se suben al repositorio, se generan con:
```bash
 npm install 
 # o 
 yarn.
 ```

## Problema conocido: Fuentes TTF en Babylon Native

Babylon Native no carga fuentes TTF directamente desde los assets, como en Babylon.js web.

**Solución:**

- Coloca la fuente en src/assets/fonts/droidsans.ttf.

- Usa react-native-fs para leer el archivo en base64.

- Convierte a ArrayBuffer usando Buffer.

- Regístrala en Babylon Native usando _native.Canvas.loadTTFAsync.

**Ejemplo:**
```js


import fs from 'react-native-fs';
import { Buffer } from 'buffer';

const base64ToArrayBuffer = (base64) => {
  const binary = Buffer.from(base64, 'base64');
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
};

const loadTTF = async () => {
  const base64 = await fs.readFileAssets('fonts/droidsans.ttf', 'base64');
  const arrayBuffer = base64ToArrayBuffer(base64);
  _native.Canvas.loadTTFAsync('Arial', arrayBuffer);
};
```

Esto asegura que Babylon Native pueda renderizar texto con tu fuente personalizada en Android (iOS requiere un método similar).

## Instalación y ejecución

Instalar dependencias:
```bash
npm install
# o
yarn install
```

### Iniciar el servidor Metro:
```bash
npm start
# o
yarn start
```

### Ejecutar la app:

Android
```bash
npm run android
# o
yarn android
```
iOS
```bash
npm run ios
# o
yarn ios
```

Asegúrate de tener configurado tu entorno según React Native Environment Setup.


