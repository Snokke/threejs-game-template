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

  static getGui() {
    return GUIHelper.instance.gui;
  }

  static getFolder(name) {
    return GUIHelper.instance.getFolder(name);
  }
}

GUIHelper.instance = null;
