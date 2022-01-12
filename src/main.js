import '../html/style.css';
import Loader from './core/loader';
import BaseScene from './core/base-scene';

const baseScene = new BaseScene();

document.addEventListener('onLoad', () => {
  baseScene.createGameScene();

  setTimeout(() => baseScene.afterAssetsLoaded(), 500);
});

const loader = new Loader();
loader.start();
