import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const textures = [
  'wooden_crate_base_color.png',
];

const models = [
  'duck.glb',
  'FlightHelmet/FlightHelmet.gltf',
];

const loadingBarElement = document.querySelector('.loading-bar');
const loadingPercentElement = document.querySelector('.loading-percent');
let progressRatio = 0;

export default class Loader {
  constructor() {
    Loader.assets = {};

    this._manager = new THREE.LoadingManager(this._onLoaded, this._onProgress);

    this._loadTextures();
    this._loadModels();
  }

  _onLoaded() {
    setTimeout(() => {
      loadingBarElement.classList.add('ended');
      loadingBarElement.style.transform = '';
      loadingBarElement.style.transition = '';

      loadingPercentElement.classList.add('ended');
    }, 500);

    const customEvent = new Event('onLoad');
    document.dispatchEvent(customEvent);
  }

  _onProgress(itemUrl, itemsLoaded, itemsTotal) {
    progressRatio = Math.max(itemsLoaded / itemsTotal, progressRatio);
    loadingBarElement.style.transition = 'transform 0.4s';
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;

    const percent = Math.floor(progressRatio * 100);
    loadingPercentElement.innerHTML = `${percent}%`;
  }

  _loadTextures() {
    const textureLoader = new THREE.TextureLoader(this._manager);

    const texturesBasePath = '/textures/';

    textures.forEach((textureFilename) => {
      const textureFullPath = `${texturesBasePath}${textureFilename}`;
      const textureName = textureFilename.replace(/\.[^/.]+$/, "");
      Loader.assets[textureName] = textureLoader.load(textureFullPath);
    });
  }

  _loadModels() {
    const gltfLoader = new GLTFLoader(this._manager);

    const modelsBasePath = '/models/';

    models.forEach((modelFilename) => {
      const modelFullPath = `${modelsBasePath}${modelFilename}`;
      const modelName = modelFilename.replace(/\.[^/.]+$/, "");
      gltfLoader.load(modelFullPath, (gltfModel) => this._onAssetLoad(gltfModel, modelName));
    });
  }

  _onAssetLoad(asset, name) {
    Loader.assets[name] = asset;
  }
}
