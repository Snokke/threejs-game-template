import { DisplayObject, Message } from "black-engine";
import Button from "./button";

export default class Scene2D extends DisplayObject {
  constructor() {
    super();

    this.touchable = true;
  }

  onAdded() {
    this._initButton();
    this._initSignals();

    this.stage.on(Message.RESIZE, this._handleResize, this);
    this._handleResize();
  }

  _handleResize() {
    const bounds = this.stage.bounds;

    this._button.x = this.stage.centerX;
    this._button.y = bounds.bottom - 100;
  }

  _initButton() {
    const button = this._button = new Button();
    this.add(button);
  }

  _initSignals() {
    this._button.on('button_click', () => this.post('button_click'));
  }
}
