import '../html/style.css';
import Loader from './loader';
import ThreeJSScene from './three-js-scene';

const threeJSScene = new ThreeJSScene();
new Loader();

document.addEventListener('onLoad', () => {
  threeJSScene.createGameScene();
  setTimeout(() => threeJSScene.hideLoadingOverlay(), 500);
}, false);
