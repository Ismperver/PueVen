import { Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

// 👇 Import GUI
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

export function createScene(engine) {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl();

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

  // 🟦 Crear GUI sobre la escena
  const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // 🔘 Botón
  const btn = Button.CreateSimpleButton("btn", "Pulsar");
  btn.width = "160px";
  btn.height = "60px";
  btn.color = "white";        // color del texto
  btn.fontSize = 24;          // tamaño del texto (recomendado > 20 en Android)
  btn.fontFamily = "Arial";   // 👈 Forzar fuente conocida
  btn.background = "blue";
  btn.thickness = 0;
  btn.alpha = 0.9;


  btn.onPointerUpObservable.add(() => {
    console.log("Botón pulsado ✅");
  });

  guiTexture.addControl(btn);

  return scene;
}
