import { Sprite } from './Sprite';

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export interface GameObjectConfig {
  x?: number;
  y?: number;
  src: string;
  direction?: Direction;
}

export class GameObject {
  x: number;
  y: number;
  sprite: Sprite;
  direction: Direction;

  constructor(config: GameObjectConfig) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || Direction.Down;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });
  }

  update(state: { arrow: Direction }) {}
}
