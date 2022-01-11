import '../html/style.css';
import Loader from './loader';
import ThreeJSScene from './three-js-scene';

const threeJSScene = new ThreeJSScene();
new Loader();

document.addEventListener('onLoad', () => {
  threeJSScene.setEnvironmentMap();
  threeJSScene.createGameScene();

  setTimeout(() => {
    threeJSScene.hideLoadingOverlay();
    threeJSScene.showUIControls();
    threeJSScene.enableOrbitControls();
  }, 500);
}, false);
