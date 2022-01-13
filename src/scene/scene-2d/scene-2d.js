import { DisplayObject, Message } from "black-engine";
import Button from "./button";

export default class Scene2D extends DisplayObject {
  constructor() {
    super();

    this._spawnButton = null;
    this._resetButton = null;

    this.touchable = true;
  }

  onAdded() {
    this._initSpawnButton();
    this._initResetButton();
    this._initSignals();

    this.stage.on(Message.RESIZE, this._handleResize, this);
    this._handleResize();
  }

  _handleResize() {
    const bounds = this.stage.bounds;

    this._spawnButton.x = this.stage.centerX - 150;
    this._spawnButton.y = bounds.bottom - 100;

    this._resetButton.x = this.stage.centerX + 150;
    this._resetButton.y = bounds.bottom - 100;
  }

  _initSpawnButton() {
    const spawnButton = this._spawnButton = new Button('Spawn', 'button-green');
    this.add(spawnButton);
  }

  _initResetButton() {
    const resetButton = this._resetButton = new Button('Reset', 'button-red');
    this.add(resetButton);
  }

  _initSignals() {
    this._spawnButton.on('button_click', () => this.post('spawn_click'));
    this._resetButton.on('button_click', () => this.post('reset_click'));
  }
}
