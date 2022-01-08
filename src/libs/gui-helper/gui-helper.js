import GUI from "lil-gui";

let instance = null;

export default class GUIHelper {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.gui = new GUI();

    return this;
  }

  static getInstance() {
    return instance;
  }

  getFolder(name) {
    const folders = this.gui.folders;

    for (let i = 0; i < folders.length; i += 1) {
      const folder = folders[i];

      if (folder._title === name) {
        return folder;
      }
    }

    return null;
  }
}
