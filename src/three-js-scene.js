import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import BASE_CONFIG from './base-config';
import GUIHelper from './libs/gui-helper/gui-helper';
import GameScene from './scene/game-scene';
import Stats from "stats.js";
import { GUIFolders, GUIFoldersVisibility } from './libs/gui-helper/gui-helper-config';
import TWEEN from '@tweenjs/tween.js';

const canvas = document.querySelector('canvas.webgl');

export default class ThreeJSScene {
  constructor() {

    this._scene = null;
    this._renderer = null;
    this._camera = null;
    this._controls = null;
    this._ambientLight = null;
    this._directionalLight = null;
    this._directionalLightHelper = null;
    this._axesHelper = null;
    this._stats = null;
    this._windowSizes = {};

    this._init();
  }

  _init() {
    this._initGUI();
    this._initFPSMeter();

    this._initScene();
    this._initRenderer();
    this._initCamera();
    this._initLights();
    this._initOnResize();
    this._initGameScene();

    this._initAxesHelper();
    this._setBackgroundColor();
    this._setupGUI();

    this._initUpdate();
  }

  _initGUI() {
    const { gui } = new GUIHelper();

    const folderKeys = Object.keys(GUIFolders);
    folderKeys.forEach((folderName) => {
      const folder = gui.addFolder(folderName);
      folder.close();

      if (!GUIFoldersVisibility[folderName]) {
        folder.hide();
      }
    });
  }

  _initFPSMeter() {
    const stats = this._stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
  }

  _initScene() {
    this._scene = new THREE.Scene();
  }

  _initRenderer() {
    this._windowSizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const renderer = this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: BASE_CONFIG.antialias,
    });

    renderer.setSize(this._windowSizes.width, this._windowSizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _initCamera() {
    const camera = this._camera = new THREE.PerspectiveCamera(BASE_CONFIG.camera.fov, this._windowSizes.width / this._windowSizes.height, BASE_CONFIG.camera.near, BASE_CONFIG.camera.far);
    this._scene.add(camera);

    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    const controls = this._controls = new OrbitControls(this._camera, canvas);
    controls.enableDamping = true;
  }

  _initLights() {
    const ambientLightConfig = BASE_CONFIG.lights.ambient;
    const ambientLight = this._ambientLight = new THREE.AmbientLight(ambientLightConfig.color, ambientLightConfig.intensity);
    this._scene.add(ambientLight);

    const directionalLightConfig = BASE_CONFIG.lights.directional;
    const directionalLight = this._directionalLight = new THREE.DirectionalLight(directionalLightConfig.color, directionalLightConfig.intensity);
    directionalLight.position.set(directionalLightConfig.position.x, directionalLightConfig.position.y, directionalLightConfig.position.z);
    this._scene.add(directionalLight);

    const directionalLightHelper = this._directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    this._scene.add(directionalLightHelper);
  }

  _initOnResize() {
    window.addEventListener('resize', () => {
      this._windowSizes.width = window.innerWidth;
      this._windowSizes.height = window.innerHeight;

      this._camera.aspect = this._windowSizes.width / this._windowSizes.height;
      this._camera.updateProjectionMatrix();

      this._renderer.setSize(this._windowSizes.width, this._windowSizes.height);
      this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  _initGameScene() {
    const gameScene = this._gameScene = new GameScene(this._camera);
    this._scene.add(gameScene);
  }

  _initAxesHelper() {
    const axesHelper = this._axesHelper = new THREE.AxesHelper(3);
    this._scene.add(axesHelper);
  }

  _setBackgroundColor() {
    this._scene.background = new THREE.Color(BASE_CONFIG.backgroundColor);
  }

  _setupGUI() {
    this._setupHelpersGUI();
    this._setupLightsGUI();
  }

  _setupHelpersGUI() {
    const guiHelper = GUIHelper.getInstance();

    const allHelpers = { enabled: true };
    const allHelpersName = 'Enable all helpers';
    const guiHelpersFolder = guiHelper.getFolder(GUIFolders.Helpers);
    guiHelpersFolder.add(allHelpers, 'enabled')
      .name(allHelpersName)
      .onChange((value) => {
        guiHelpersFolder.controllers.forEach((controller) => {
          if (controller._name !== allHelpersName) {
            controller.setValue(value);
          }
        });
      });

    guiHelpersFolder.add(this._controls, 'enabled')
      .name('Orbit controls')
      .onChange(() => this._controls.reset());

    guiHelpersFolder.add(this._directionalLightHelper, 'visible')
      .name('Directional light');

    guiHelpersFolder.add(this._axesHelper, 'visible')
      .name('Axes');

    const fpsMeter = { visible: true };
    guiHelpersFolder.add(fpsMeter, 'visible')
      .name('FPS meter')
      .onChange((value) => {
        if (value) {
          this._stats.dom.style.visibility = 'visible';
        } else {
          this._stats.dom.style.visibility = 'hidden';
        }
      });
  }

  _setupLightsGUI() {
    const guiHelper = GUIHelper.getInstance();

    const guiLightsFolder = guiHelper.getFolder(GUIFolders.Lights);
    const guiAmbientFolder = guiLightsFolder.addFolder('Ambient');
    guiAmbientFolder.close();
    guiAmbientFolder.add(this._ambientLight, 'visible')
      .name('Enabled');

    guiAmbientFolder.addColor(this._ambientLight, 'color')
      .name('Color');

    guiAmbientFolder.add(this._ambientLight, 'intensity', 0, 1)
      .name('Intensity');

    const directionalFolder = guiLightsFolder.addFolder('Directional');
    directionalFolder.close();
    directionalFolder.add(this._directionalLight, 'visible')
      .name('Enabled');

    directionalFolder.addColor(this._directionalLight, 'color')
      .name('Color');

    directionalFolder.add(this._directionalLight, 'intensity', 0, 1)
      .name('Intensity');

    directionalFolder.add(this._directionalLight.position, 'x', -10, 10)
      .name('x')
      .onChange(() => this._directionalLightHelper.update());

    directionalFolder.add(this._directionalLight.position, 'y', -10, 10)
      .name('y')
      .onChange(() => this._directionalLightHelper.update());

    directionalFolder.add(this._directionalLight.position, 'z', -10, 10)
      .name('z')
      .onChange(() => this._directionalLightHelper.update());
  }

  _initUpdate() {
    const clock = new THREE.Clock();
    let lastElapsedTime = 0;

    const update = () => {
      this._stats.begin();

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;

      TWEEN.update();
      this._controls.update();
      this._gameScene.update(deltaTime);
      this._renderer.render(this._scene, this._camera);

      this._stats.end();
      window.requestAnimationFrame(update);
    }

    update();
  }
}
