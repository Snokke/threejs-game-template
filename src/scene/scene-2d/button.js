import { DisplayObject, Ease, FontAlign, Sprite, TextField, Tween } from "black-engine";

export default class Button extends DisplayObject {
  constructor() {
    super();

    this._view = null;

    this.touchable = true;
  }

  _onClick() {
    this.post('button_click');

    this.removeComponent(this._view.getComponent(Tween));
    this.scale = 1;

    const tween = new Tween({ scale: 0.97 }, 0.1, {
      yoyo: true,
      repeats: 1,
      ease: Ease.sinusoidalInOut,
    })

    this.add(tween);
  }

  onAdded() {
    this._initView();
    this._initText();
  }

  _initView() {
    const view = this._view = new Sprite('button');
    this.addChild(view);

    view.alignAnchor(0.5, 0.5);

    view.touchable = true;
    view.on('pointerDown', (msg, p) => this._onClick());
  }

  _initText() {
    const buttonText = new TextField('Button', 'Arial', 0xffffff, 50);
    buttonText.align = FontAlign.CENTER;
    buttonText.alignPivotOffset();
    this.add(buttonText);
  }
}
