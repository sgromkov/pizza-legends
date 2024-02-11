import {
  ActionState,
  Direction,
  GameObject,
  GameObjectConfig,
} from './GameObject';
import { OverworldMap } from './OverworldMap';
import { AnimationKey } from './Sprite';

interface PersonConfig extends GameObjectConfig {
  isPlayerControlled?: boolean;
}

enum PersonAction {
  Walk = 'walk',
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
      [Direction.Up]: ['y', -0.5],
      [Direction.Down]: ['y', 0.5],
      [Direction.Left]: ['x', -0.5],
      [Direction.Right]: ['x', 0.5],
    };
  }

  update(state: ActionState): void {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // Case: We are keyboard ready and have an arrow pressed:
      if (this.isPlayerControlled && state.arrow) {
        this.startBehaviour(state, {
          type: PersonAction.Walk,
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  startBehaviour(
    state: ActionState,
    behaviour: { type: PersonAction; direction: Direction }
  ): void {
    // Set character direction to whatever behaviour has:
    this.direction = behaviour.direction;

    if (behaviour.type === PersonAction.Walk) {
      // Stop here if space is not free:
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      // Move character:
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition(): void {
    const [property, change] = this.directionUpdate[this.direction];

    this[property] += change;
    this.movingProgressRemaining -= 0.5;
  }

  updateSprite(): void {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(('walk-' + this.direction) as AnimationKey);

      return;
    }

    this.sprite.setAnimation(('idle-' + this.direction) as AnimationKey);
  }
}
