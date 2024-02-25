import {
  ActionState,
  Direction,
  GameObject,
  GameObjectConfig,
  GameObjectAction,
  GameObjectBehaviour,
} from './GameObject';
import { OverworldMap } from './OverworldMap';
import { AnimationKey } from './Sprite';
import { emitEvent, EventName } from './utils';

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
    this.isStanding = false;
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
      if (
        !state.map.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehaviour(state, {
          type: GameObjectAction.Walk,
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  startBehaviour(state: ActionState, behaviour: GameObjectBehaviour): void {
    // Set character direction to whatever behaviour has:
    this.direction = behaviour.direction;

    if (behaviour.type === GameObjectAction.Walk) {
      // Stop here if space is not free:
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        if (behaviour.retry) {
          setTimeout(() => {
            this.startBehaviour(state, behaviour);
          }, 10);
        }

        return;
      }

      // Move character:
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite();
    }

    if (behaviour.type === GameObjectAction.Stand) {
      this.isStanding = true;
      setTimeout(() => {
        emitEvent(EventName.PersonStandComplete, { whoId: this.id });
        this.isStanding = false;
      }, behaviour.time);
    }
  }

  updatePosition(): void {
    const [property, change] = this.directionUpdate[this.direction];

    this[property] += change;
    this.movingProgressRemaining -= 0.5;

    if (this.movingProgressRemaining === 0) {
      // We finished the walk!
      emitEvent(EventName.PersonWalkingComplete, { whoId: this.id });
    }
  }

  updateSprite(): void {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(('walk-' + this.direction) as AnimationKey);

      return;
    }

    this.sprite.setAnimation(('idle-' + this.direction) as AnimationKey);
  }
}
