import { Sprite } from './Sprite';

interface Config {
  x?: number;
  y?: number;
  src: string;
}

export class GameObject {
  x: number;
  y: number;
  sprite: Sprite;

  constructor(config: Config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });
  }
}
