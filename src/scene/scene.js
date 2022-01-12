import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Loader from '../core/loader';
import Physics from '../core/physics';

export default class Scene extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;

    this._init();
  }

  update(dt) {

  }

  _init() {
    this._initFloor();
    this._initSphere();
    this._initBox();
    this._initBox2();
  }

  _initFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
          color: '#777777',
          metalness: 0.3,
          roughness: 0.4,
          envMap: Loader.environmentMap,
          envMapIntensity: 1,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    this.add(floor);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane()
    });

    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    Physics.addBody(body, floor);
  }

  _initSphere() {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: Loader.environmentMap,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.castShadow = true;
    this.add(mesh);

    const sphereBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.5),
    });

    Physics.addBody(sphereBody, mesh);

    sphereBody.position.set(0, 5, 0);
  }

  _initBox() {
    const boxGeometry = new THREE.BoxGeometry(1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: Loader.environmentMap,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.castShadow = true;
    this.add(mesh);

    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5)),
    });

    Physics.addBody(boxBody, mesh);

    boxBody.position.set(0, 1, 0.5);
  }

  _initBox2() {
    const boxGeometry = new THREE.BoxGeometry(1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: Loader.environmentMap,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.castShadow = true;
    this.add(mesh);

    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5)),
    });

    Physics.addBody(boxBody, mesh);

    boxBody.position.set(0, 3, 0);
  }
}
