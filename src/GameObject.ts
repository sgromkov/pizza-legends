import { BehaviourEvent, OverworldEvent } from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { Sprite } from './Sprite';

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export enum GameObjectAction {
  Walk = 'walk',
  Stand = 'stand',
}

export interface GameObjectBehaviour {
  type: GameObjectAction;
  direction: Direction;
  time?: number;
  retry?: boolean;
}

export interface ActionState {
  arrow?: Direction;
  map: OverworldMap;
}

export interface GameObjectConfig {
  x?: number;
  y?: number;
  src: string;
  direction?: Direction;
  behaviourLoop?: GameObjectBehaviour[];
}

export class GameObject {
  id: string;
  x: number;
  y: number;
  sprite: Sprite;
  direction: Direction;
  isMounted: boolean;
  behaviourLoop: GameObjectBehaviour[];
  behaviourLoopIndex: number;

  constructor(config: GameObjectConfig) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || Direction.Down;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });
    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;
  }

  mount(map: OverworldMap): void {
    this.isMounted = true;

    map.addWall(this.x, this.y);

    // If we have a behaviour, kick off after a short delay:
    setTimeout(() => {
      this.doBehaviourEvent(map);
    }, 10);
  }

  update(state: ActionState): void {}

  startBehaviour(state: ActionState, behaviour: GameObjectBehaviour): void {}

  async doBehaviourEvent(map: OverworldMap): Promise<void> {
    if (map.isCutscenePlaying || this.behaviourLoop.length === 0) {
      return;
    }

    // Setting up our event with relevant info:
    const eventConfig: BehaviourEvent = {
      ...this.behaviourLoop[this.behaviourLoopIndex],
      who: this.id,
    };

    // Create an event instance out of our next event config:
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting the next event to fire:
    this.behaviourLoopIndex += 1;
    if (this.behaviourLoopIndex === this.behaviourLoop.length) {
      this.behaviourLoopIndex = 0;
    }

    // Do it again:
    this.doBehaviourEvent(map);
  }
}
