import { GameObjectEvent, GameObjectEventPayload } from './GameObjectEvent';
import { EventPayload } from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { Sprite } from './Sprite';

export enum GameObjectName {
  Hero = 'hero',
  Npc1 = 'npc1',
  Npc2 = 'npc2',
  Npc3 = 'npc3',
}

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
  talking?: Array<{
    events: EventPayload[];
  }>;
}

export class GameObject {
  id: GameObjectName;
  x: number;
  y: number;
  sprite: Sprite;
  direction: Direction;
  isMounted: boolean;
  behaviourLoop: GameObjectBehaviour[];
  behaviourLoopIndex: number;
  isStanding: boolean;
  talking?: Array<{
    events: EventPayload[];
  }>;

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
    this.talking = config.talking || [];
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
    if (
      map.isCutscenePlaying ||
      this.behaviourLoop.length === 0 ||
      this.isStanding
    ) {
      return;
    }

    // Setting up our event with relevant info:
    const eventConfig: GameObjectEventPayload = {
      ...this.behaviourLoop[this.behaviourLoopIndex],
      who: this.id,
    };

    // Create an event instance out of our next event config:
    const eventHandler = new GameObjectEvent({ map, event: eventConfig });
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
