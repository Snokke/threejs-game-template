import '../html/style.css';
import Loader from './loader';
import ThreeJSScene from './three-js-scene';

const threeJSScene = new ThreeJSScene();

document.addEventListener('onLoad', () => {
  threeJSScene.createGameScene();

  setTimeout(() => {
    threeJSScene.afterAssetsLoaded();
  }, 500);
}, false);

const loader = new Loader();
loader.start();
