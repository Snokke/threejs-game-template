import GUIHelper from "../helpers/gui-helper/gui-helper";
import { GUIFolders, GUIFoldersVisibility } from "../helpers/gui-helper/gui-helper-config";
import BASE_CONFIG from "./base-config";

export default class BaseGUI {
  constructor(gui) {
    this._gui = gui;
  }

  showAfterAssetsLoad() {
    this._gui.show();

    this._gui.controllers.forEach((controller) => {
      if (controller._name === 'Orbit controls') {
        controller.setValue(true);
      }
    });
  }

  setup(data) {
    this._controls = data.controls;
    this._stats = data.stats;
    this._physics = data.physics;
    this._axesHelper = data.axesHelper;
    this._ambientLight = data.ambientLight;
    this._directionalLight = data.directionalLight;
    this._directionalLightHelper = data.directionalLightHelper;

    this._setupMainGUI();
    this._setupFolders();
    this._setupHelpersGUI();
    this._setupLightsGUI();
  }

  _setupMainGUI() {
    this._gui.add(this._controls, 'enabled')
      .name('Orbit controls')
      .onChange(() => this._controls.reset());
  }

  _setupFolders() {
    const folderKeys = Object.keys(GUIFolders);
    folderKeys.forEach((folderName) => {
      const folder = this._gui.addFolder(folderName);
      folder.close();

      if (!GUIFoldersVisibility[folderName]) {
        folder.hide();
      }
    });
  }

  _setupHelpersGUI() {
    const allHelpers = { enabled: true };
    const allHelpersName = 'Enable all helpers';
    const guiHelpersFolder = GUIHelper.getFolder(GUIFolders.Helpers);
    guiHelpersFolder.add(allHelpers, 'enabled')
      .name(allHelpersName)
      .onChange((value) => {
        guiHelpersFolder.controllers.forEach((controller) => {
          if (controller._name !== allHelpersName) {
            controller.setValue(value);
          }
        });
      });

    if (BASE_CONFIG.physics.enableCannonDebugger) {
      this._physics.initDebuggerGuiHelper();
    }

    guiHelpersFolder.add(this._directionalLightHelper, 'visible')
      .name('Directional light');

    guiHelpersFolder.add(this._axesHelper, 'visible')
      .name('Axes');

    const fpsMeter = { visible: true };
    guiHelpersFolder.add(fpsMeter, 'visible')
      .name('FPS meter')
      .onChange((value) => {
        if (value) {
          this._stats.dom.style.visibility = 'visible';
        } else {
          this._stats.dom.style.visibility = 'hidden';
        }
      });
  }

  _setupLightsGUI() {
    const guiLightsFolder = GUIHelper.getFolder(GUIFolders.Lights);
    const guiAmbientFolder = guiLightsFolder.addFolder('Ambient');
    guiAmbientFolder.close();
    guiAmbientFolder.add(this._ambientLight, 'visible')
      .name('Enabled');

    guiAmbientFolder.addColor(this._ambientLight, 'color')
      .name('Color');

    guiAmbientFolder.add(this._ambientLight, 'intensity', 0, 10)
      .name('Intensity');

    const directionalFolder = guiLightsFolder.addFolder('Directional');
    directionalFolder.close();
    directionalFolder.add(this._directionalLight, 'visible')
      .name('Enabled');

    directionalFolder.addColor(this._directionalLight, 'color')
      .name('Color');

    directionalFolder.add(this._directionalLight, 'intensity', 0, 10)
      .name('Intensity');

    directionalFolder.add(this._directionalLight.position, 'x', -10, 10)
      .name('x')
      .onChange(() => this._directionalLightHelper.update());

    directionalFolder.add(this._directionalLight.position, 'y', -10, 10)
      .name('y')
      .onChange(() => this._directionalLightHelper.update());

    directionalFolder.add(this._directionalLight.position, 'z', -10, 10)
      .name('z')
      .onChange(() => this._directionalLightHelper.update());
  }
}
