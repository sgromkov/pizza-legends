import { Direction } from './GameObject';

export enum DirectionKeyCode {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
}

export class DirectionInput {
  heldDirections: Direction[];
  map: Record<DirectionKeyCode, Direction>;

  constructor() {
    this.heldDirections = [];

    this.map = {
      [DirectionKeyCode.ArrowUp]: Direction.Up,
      [DirectionKeyCode.ArrowDown]: Direction.Down,
      [DirectionKeyCode.ArrowLeft]: Direction.Left,
      [DirectionKeyCode.ArrowRight]: Direction.Right,
    };
  }

  get direction(): Direction {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener('keydown', (e) => {
      const dir = this.map[e.code as DirectionKeyCode];

      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener('keyup', (e) => {
      const dir = this.map[e.code as DirectionKeyCode];
      const index = this.heldDirections.indexOf(dir);

      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}
