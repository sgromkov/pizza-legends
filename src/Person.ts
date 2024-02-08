import { Direction, GameObject, GameObjectConfig } from './GameObject';
import { AnimationKey } from './Sprite';

interface PersonConfig extends GameObjectConfig {
  isPlayerControlled?: boolean;
}

export class Person extends GameObject {
  movingProgressRemaining: number;
  directionUpdate: Record<Direction, [string, number]>;
  isPlayerControlled: boolean;

  constructor(config: PersonConfig) {
    super(config);

    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      [Direction.Up]: ['y', -1],
      [Direction.Down]: ['y', 1],
      [Direction.Left]: ['x', -1],
      [Direction.Right]: ['x', 1],
    };
  }

  update(state: { arrow: Direction }) {
    this.updatePosition();
    this.updateSprite(state);

    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.arrow
    ) {
      this.direction = state.arrow;
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];

      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  updateSprite(state: { arrow: Direction }) {
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      !state.arrow
    ) {
      this.sprite.setAnimation(('idle-' + this.direction) as AnimationKey);
      return;
    }

    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(('walk-' + this.direction) as AnimationKey);
    }
  }
}
