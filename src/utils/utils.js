import * as THREE from 'three';
import Loader from "../loader";

export default class Utils {
  static createObject(name) {
    const object = Loader.assets[name];

    if (!object) {
      throw new Error(`Object ${name} is not found.`);
    }

    const group = new THREE.Group();
    const children = [...object.scene.children];

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      group.add(child);
    }

    return group;
  }
}
