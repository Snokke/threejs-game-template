import * as THREE from 'three';
import { GUIFolders } from '../libs/gui-helper/gui-helper-config';
import GUIHelper from '../libs/gui-helper/gui-helper';
import TWEEN from '@tweenjs/tween.js';

export default class GameScene extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;
    this._sphere = null;

    this._init();
  }

  update(dt) {
    this._sphere.rotation.y += dt;
  }

  _init() {
    this._initSphere();
    this._tweenExample();
  }

  _initSphere() {
    const geometry = new THREE.BoxBufferGeometry(1);
    const material = new THREE.MeshLambertMaterial({ color: 0xaa0000 });

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
}
