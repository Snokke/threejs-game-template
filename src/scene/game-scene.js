import * as THREE from 'three';
import { GUIFolders } from '../libs/gui-helper/gui-helper-config';
import GUIHelper from '../libs/gui-helper/gui-helper';
import TWEEN from '@tweenjs/tween.js';
import Loader from '../loader';
import Utils from '../utils/utils';

export default class GameScene extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;
    this._sphere = null;
    this._helmet = null;
    this._envMapIntensity = 1;

    this._init();
  }

  update(dt) {
    // this._sphere.rotation.y += dt;
  }

  _init() {
    // this._initSphere();
    // this._tweenExample();
    this._initDuck();
  }

  _initSphere() {
    const texture = Loader.assets['wooden_crate_base_color'];

    const geometry = new THREE.BoxBufferGeometry(1);
    const material = new THREE.MeshLambertMaterial({
      map: texture,
      // color: 0xaa0000,
    });

    const sphere = this._sphere = new THREE.Mesh(geometry, material);
    this.add(sphere);

    const guiFolder = GUIHelper.getInstance().getFolder(GUIFolders.Custom);
    const scale = { sphereScale: 1 };
    guiFolder.add(scale, 'sphereScale', 0, 10)
      .name('Box scale')
      .onChange((value) => sphere.scale.set(value, value, value));
  }

  _tweenExample() {
    new TWEEN.Tween(this._sphere.position)
      .to({ y: 2 }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .repeat(5)
      .yoyo(true)
      .start();
  }

  _initDuck() {
    const helmet = this._helmet = Utils.createObject('FlightHelmet/FlightHelmet');
    this.add(helmet);

    helmet.scale.set(3, 3, 3);
    helmet.position.y = -1.5;
    helmet.rotation.y = Math.PI * 0.75;

    const environmentMapIntensity = { value: 1 };
    const guiHelper = GUIHelper.getInstance();
    const guiTexturesFolder = guiHelper.getFolder(GUIFolders.Textures);
    guiTexturesFolder.add(environmentMapIntensity, 'value', 0, 10)
      .name('envMap Intensity')
      .onChange((value) => {
        this._envMapIntensity = value;
        this._updateMaterials();
      });

    this._updateMaterials();

    const guiRendererFolder = guiHelper.getFolder(GUIFolders.Renderer);

    guiRendererFolder.controllers.forEach((controller) => {
      if (controller._name === 'Tone mapping') {
        controller.onChange(() => {
          this._updateMaterials();
        });
      }
    });
  }

  _updateMaterials() {
    this._helmet.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = this._envMapIntensity;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    })
  }
}
