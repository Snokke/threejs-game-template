import * as THREE from 'three';
import { AssetManager, GameObject } from 'black-engine';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import buttonGreen from '../../assets/black-textures/button-green.png';
import buttonRed from '../../assets/black-textures/button-red.png';

const textures = [
];

const models = [
];

const loadingBarElement = document.querySelector('.loading-bar');
const loadingPercentElement = document.querySelector('.loading-percent');
let progressRatio = 0;
const blackAssetsProgressPart = 0.5;

export default class Loader extends GameObject {
  constructor() {
    super();

    Loader.assets = {};

    this._threeJSManager = new THREE.LoadingManager(this._onThreeJSAssetsLoaded, this._onThreeJSAssetsProgress);
    this._blackManager = new AssetManager();

    this._loadBlackAssets();
  }

  _loadBlackAssets() {
    this._blackManager.enqueueImage('button-green', buttonGreen);
    this._blackManager.enqueueImage('button-red', buttonRed);

    this._blackManager.on('complete', this._onBlackAssetsLoaded, this);
    this._blackManager.on('progress', this._onBlackAssetsProgress, this);

    this._blackManager.loadQueue();
  }

  _onBlackAssetsProgress(item, progress) {
    progressRatio = progress * 0.5;

    loadingBarElement.style.transition = 'transform 0.4s';
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;

    const percent = Math.floor(progressRatio * 100);
    loadingPercentElement.innerHTML = `${percent}%`;
  }

  _onBlackAssetsLoaded() {
    this.removeFromParent();
    this._loadThreeJSAssets();
  }

  _loadThreeJSAssets() {
    this._loadTextures();
    this._loadModels();
    this._loadEnvironmentMap();

    if (textures.length === 0 && models.length === 0 && !Loader.environmentMap) {
      this._onThreeJSAssetsLoaded();
    }
  }

  _onThreeJSAssetsLoaded() {
    setTimeout(() => {
      loadingBarElement.classList.add('ended');
      loadingBarElement.style.transform = '';
      loadingBarElement.style.transition = '';

      loadingPercentElement.classList.add('ended');
    }, 500);

    setTimeout(() => {
      const customEvent = new Event('onLoad');
      document.dispatchEvent(customEvent);
    }, 100);
  }

  _onThreeJSAssetsProgress(itemUrl, itemsLoaded, itemsTotal) {
    progressRatio = Math.max(blackAssetsProgressPart + (itemsLoaded / itemsTotal) * 0.5, progressRatio);

    loadingBarElement.style.transition = 'transform 0.4s';
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;

    const percent = Math.floor(progressRatio * 100);
    loadingPercentElement.innerHTML = `${percent}%`;
  }

  _loadTextures() {
    const textureLoader = new THREE.TextureLoader(this._threeJSManager);

    const texturesBasePath = '/three-js-textures/';

    textures.forEach((textureFilename) => {
      const textureFullPath = `${texturesBasePath}${textureFilename}`;
      const textureName = textureFilename.replace(/\.[^/.]+$/, "");
      Loader.assets[textureName] = textureLoader.load(textureFullPath);
    });
  }

  _loadModels() {
    const gltfLoader = new GLTFLoader(this._threeJSManager);

    const modelsBasePath = '/three-js-models/';

    models.forEach((modelFilename) => {
      const modelFullPath = `${modelsBasePath}${modelFilename}`;
      const modelName = modelFilename.replace(/\.[^/.]+$/, "");
      gltfLoader.load(modelFullPath, (gltfModel) => this._onAssetLoad(gltfModel, modelName));
    });
  }

  _loadEnvironmentMap() {
    const cubeTextureLoader = new THREE.CubeTextureLoader(this._threeJSManager);
    const environmentMap = cubeTextureLoader.load([
      '/three-js-textures/environment_maps/px.png',
      '/three-js-textures/environment_maps/nx.png',
      '/three-js-textures/environment_maps/py.png',
      '/three-js-textures/environment_maps/ny.png',
      '/three-js-textures/environment_maps/pz.png',
      '/three-js-textures/environment_maps/nz.png',
    ]);

    environmentMap.encoding = THREE.sRGBEncoding;
    Loader.environmentMap = environmentMap;
  }

  _onAssetLoad(asset, name) {
    Loader.assets[name] = asset;
  }
}
