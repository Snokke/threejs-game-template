import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import BASE_CONFIG from './base-config';
import GUIHelper from '../helpers/gui-helper/gui-helper';
import { GUIFolders, GUIHelpersStartState } from '../helpers/gui-helper/gui-helper-config';

export default class Physics {
  constructor(scene) {
    this._scene = scene;
    this.world = null;
    this._objects = [];
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

    body.sleepSpeedLimit = BASE_CONFIG.physics.sleepSpeedLimit;
    body.sleepTimeLimit = BASE_CONFIG.physics.sleepTimeLimit;

    this._objects.push({ body, mesh });
    this.world.addBody(body);
  }

  removeBody(body) {
    this.world.removeBody(body);
  }

  reset() {
    this._objects.forEach(({ body }) => this.removeBody(body));
    this._objects.splice(0);
  }

  initDebuggerGuiHelper() {
    const guiHelpersFolder = GUIHelper.getFolder(GUIFolders.Helpers);

    guiHelpersFolder.add(this._cannonDebuggerEnabled, 'value')
      .name('Physics debugger')
      .onChange((value) => {
        if (value) {
          GUIHelpersStartState['Physics debugger'] = true;
          this._cannonDebuggerMeshes.forEach((mesh) => mesh.visible = true);
        } else {
          GUIHelpersStartState['Physics debugger'] = false;
          this._cannonDebuggerMeshes.forEach((mesh) => mesh.visible = false);
        }
      });
  }

  _initCannonDebugger() {
    if (BASE_CONFIG.physics.enableCannonDebugger) {
      this._cannonDebugger = CannonDebugger(this._scene, this.world, {
        onInit: (body, mesh) => {
          this._cannonDebuggerMeshes.push(mesh);

          if (!GUIHelpersStartState['Physics debugger']) {
            mesh.visible = false;
          }
        }
      });
    }
  }

  update(dt) {
    this.world.step(dt, 1 / 60, 3);

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
    this.world = new CANNON.World();

    const gravity = BASE_CONFIG.physics.gravity;
    this.world.gravity = new CANNON.Vec3(gravity.x, gravity.y, gravity.z);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.broadphase.axisIndex = 1;
    this.world.allowSleep = true;
    this.world.solver.iterations = 2;
  }

  _initDefaultMaterial() {
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      { friction: 0.2, restitution: 0.5 },
    );

    this.world.defaultContactMaterial = defaultContactMaterial;
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

  static getWorld() {
    return Physics.instance.world;
  }
}

Physics.instance = null;
