import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import BASE_CONFIG from './base-config';
import GUIHelper from './libs/gui-helper/gui-helper';
import { GUIFolders } from './libs/gui-helper/gui-helper-config';

export default class Physics {
  constructor(scene) {
    this._scene = scene;
    this._objects = [];
    this._world = null;
    this._cannonDebugger = null;
    this._cannonDebuggerMeshes = [];
    this._cannonDebuggerEnabled = { value: true };

    Physics.instance = this;

    this._init();
  }

  _init() {
    this._initWorld();
    this._initDefaultMaterial();
    this._initCannonDebugger();
  }

  addBody(body, mesh, tag) {
    body.tag = tag;
    body.mesh = mesh;
    this._objects.push({ body, mesh });
    this._world.addBody(body);

    body.sleepSpeedLimit = 0.2;
    body.sleepTimeLimit = 0.5;
  }

  removeBody(body) {
    this._world.remove(body);
  }

  reset() {
    this._objects.forEach(({ body }) => this.removeBody(body));
    this._objects.splice(0);
  }

  initDebuggerFuiHelper() {
    const guiHelper = GUIHelper.getInstance();
    const guiHelpersFolder = guiHelper.getFolder(GUIFolders.Helpers);

    guiHelpersFolder.add(this._cannonDebuggerEnabled, 'value')
      .name('Physics debugger')
      .onChange((value) => {
        if (value) {
          this._cannonDebuggerMeshes.forEach((mesh) => mesh.visible = true);
        } else {
          this._cannonDebuggerMeshes.forEach((mesh) => mesh.visible = false);
        }
      });
  }

  _initCannonDebugger() {
    if (BASE_CONFIG.physics.enableCannonDebugger) {
      this._cannonDebugger = CannonDebugger(this._scene, this._world, {
        onInit: (body, mesh) => {
          this._cannonDebuggerMeshes.push(mesh);
        }
      });
    }
  }

  update(dt) {
    this._world.step(dt, 1 / 60, 3);

    if (BASE_CONFIG.physics.enableCannonDebugger) {
      this._cannonDebugger.update();
    }

    for (let i = 0; i < this._objects.length; i += 1) {
      const mesh = this._objects[i].mesh;
      const body = this._objects[i].body;

      if (mesh) {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      }
    }
  }

  onContact(body, callBack, context) {
    body.addEventListener('collide', (event) => callBack.call(context, event));
  }

  _initWorld() {
    this._world = new CANNON.World();

    this._world.gravity = new CANNON.Vec3(0, -9.82, 0);
    this._world.broadphase = new CANNON.SAPBroadphase(this._world);
    this._world.allowSleep = true;
    this._world.solver.iterations = 2;
  }

  _initDefaultMaterial() {
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      { friction: 0.1, restitution: 0.7 },
    );

    this._world.defaultContactMaterial = defaultContactMaterial;
  }

  static onContact(body, callBack, context) {
    Physics.instance.onContact(body, callBack, context);
  }

  static addBody(body, mesh, tag = '') {
    Physics.instance.addBody(body, mesh, tag);
  }

  static removeBody(body) {
    return Physics.instance.removeBody(body);
  }

  static reset() {
    return Physics.instance.reset();
  }
}

Physics.instance = null;
