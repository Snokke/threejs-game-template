import GUI from "lil-gui";

export default class GUIHelper {
  constructor() {
    this.gui = new GUI();
    this.gui.hide();

    GUIHelper.instance = this;
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

  getController(folder, name) {
    for (let i = 0; i < folder.controllers.length; i += 1) {
      const controller = folder.controllers[i];

      if (controller._name === name) {
        return controller;
      }
    }

    return null;
  }

  static getGui() {
    return GUIHelper.instance.gui;
  }

  static getFolder(name) {
    return GUIHelper.instance.getFolder(name);
  }

  static getController(folder, name) {
    return GUIHelper.instance.getController(folder, name);
  }
}

GUIHelper.instance = null;
