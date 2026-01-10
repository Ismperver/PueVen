import { initARSession } from "./arScene.js";
import { setupPath } from "./arHelpers.js";
import { disposeSelector } from "../selectorScreen/selectorScreen.js";
import { getCoordinates } from "../selectorScreen/mapView.js";
import { getDistance } from "../../utils/distanceMeter.js";
import { updateGlobalDistance } from "../../state/globalState.js";

/**
 * Inicia el modo de pantalla completa AR con guiado.
 */
export async function startARScreen(scene, store, onExit) {
    if (!scene || !store) return;

    disposeSelector();

    const xr = await initARSession(scene);

    if (xr && xr.baseExperience) {
        const destPos = getCoordinates(store.coordenadas, store.planta);
        const navigationArrows = setupPath(scene, store);

        const distanceObserver = scene.onBeforeRenderObservable.add(() => {
            if (xr.baseExperience.camera) {
                const currentPos = xr.baseExperience.camera.position;

                // Actualizar distancia y orientación dinámica
                const dist = getDistance(currentPos, destPos);
                updateGlobalDistance(dist);

                navigationArrows.forEach(arrow => {
                    arrow.lookAt(destPos);
                });
            }
        });

        xr.baseExperience.onStateChangedObservable.add((state) => {
            if (state === 3) {
                scene.onBeforeRenderObservable.remove(distanceObserver);
                navigationArrows.forEach(a => a.dispose());
                onExit();
            }
        });
    }
}