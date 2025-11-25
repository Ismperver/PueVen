import React from 'react';
import 'text-encoding-polyfill';
import { SafeAreaView, StatusBar, View, ViewProps } from 'react-native';
import { EngineView } from '@babylonjs/react-native';
import { usePlaygroundScene } from './init.js';

const EngineScreen: React.FC<ViewProps> = (props) => {
  const { camera } = usePlaygroundScene();

  return (
    <View style={props.style}>
      <View style={{ flex: 1 }}>
        <EngineView camera={camera} displayFrameRate={true} />
      </View>
    </View>
  );
};

const App = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <EngineScreen style={{ flex: 1 }} />
    </SafeAreaView>
  </>
);

export default App;
