import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Loader from '../../core/loader';
import Physics from '../../core/physics';
import Utils from '../../helpers/utils';

export default class Scene3D extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;

    this._sphereGeometry = null;
    this._boxGeometry = null;
    this._spawnObjectMaterial = null;
    this._floorMaterial = null;
    this._spawnObjects = [];

    this._init();

  }

  update(dt) {

  }

  resetItems() {
    this._spawnObjects.forEach((object) => {
      Physics.removeBody(object.body);
      this.remove(object.mesh);
    });
  }

  createItem() {
    const object = Math.random() < 0.5 ? this._createBox() : this._createSphere();
    this._spawnObjects.push(object);

    const { body } = object;
    body.position.set(Math.random() * 4 - 2, 3 + Math.random() * 7, Math.random() * 4 - 2);
  }

  _init() {
    this._initFloor();
    this._initBorders();
    this._configureGeometryAndMaterial();
  }

  _initFloor() {
    const geometry = new THREE.BoxGeometry(15, 15, 0.1);
    this._floorMaterial = new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: Loader.environmentMap,
      envMapIntensity: 1,
    });

    const floor = new THREE.Mesh(geometry, this._floorMaterial);
    this.add(floor);

    floor.receiveShadow = true;

    const size = Utils.getBoundingBox(floor);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)),
    });

    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    body.position.y = -size.z * 0.5 - 0.01;
    Physics.addBody(body, floor);
  }

  _initBorders() {
    this._initLongBorder(7.5);
    this._initLongBorder(-6.5);
    this._initShortBorder(7.5);
    this._initShortBorder(-6.5);
  }

  _initLongBorder(x) {
    const borderGeometry = new THREE.BoxGeometry(1, 1, 15);

    const mesh = new THREE.Mesh(borderGeometry, this._floorMaterial);
    this.add(mesh);

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    const size = Utils.getBoundingBox(mesh);

    const borderBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)),
    });

    Physics.addBody(borderBody, mesh);

    borderBody.position.y = size.y * 0.5 - 0.01;
    borderBody.position.x = x - size.x * 0.5;
  }

  _initShortBorder(z) {
    const borderGeometry = new THREE.BoxGeometry(13, 1, 1);

    const mesh = new THREE.Mesh(borderGeometry, this._floorMaterial);
    this.add(mesh);

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    const size = Utils.getBoundingBox(mesh);

    const borderBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)),
    });

    Physics.addBody(borderBody, mesh);

    borderBody.position.y = size.y * 0.5 - 0.01;
    borderBody.position.z = z - size.z * 0.5;
  }

  _configureGeometryAndMaterial() {
    this._sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
    this._boxGeometry = new THREE.BoxGeometry(1);
    this._spawnObjectMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: Loader.environmentMap,
      envMapIntensity: 1,
    });
  }

  _createSphere() {
    const mesh = new THREE.Mesh(this._sphereGeometry, this._spawnObjectMaterial);
    this.add(mesh);

    mesh.castShadow = true;

    const scale = 0.3 + Math.random() * 2.5;
    mesh.scale.set(scale, scale, scale);

    const size = Utils.getBoundingBox(mesh);

    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(size.y * 0.5),
    });

    Physics.addBody(body, mesh);

    return { body, mesh };
  }

  _createBox() {
    const mesh = new THREE.Mesh(this._boxGeometry, this._spawnObjectMaterial);
    this.add(mesh);

    mesh.castShadow = true;

    const scale = 0.3 + Math.random() * 2;
    mesh.scale.set(scale, scale, scale);

    const size = Utils.getBoundingBox(mesh);

    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)),
    });

    Physics.addBody(body, mesh);

    return { body, mesh };
  }
}
