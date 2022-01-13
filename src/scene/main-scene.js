import { Black } from "black-engine";
import Scene2D from "./scene-2d/scene-2d";
import Scene3D from "./scene-3d/scene-3d";

export default class MainScene {
  constructor(data) {

    this._scene = data.scene;
    this._camera = data.camera;

    this._init();
  }

  afterAssetsLoad() {
    Black.stage.addChild(this._scene2D);
    this._scene.add(this._scene3D);
  }

  update(dt) {
    this._scene3D.update(dt);
  }

  _init() {
    this._scene3D = new Scene3D(this._camera);
    this._scene2D = new Scene2D();

    this._initSignals();
  }

  _initSignals() {
    this._scene2D.on('spawn_click', () => {
      this._scene3D.createItem();
    });

    this._scene2D.on('reset_click', () => {
      this._scene3D.resetItems();
    });
  }
}
