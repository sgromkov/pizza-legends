import {
  OverworldEvent,
  OverworldEventAction,
  OverworldEventPayload,
  OverworldEventStandPayload,
  OverworldEventWalkPayload,
} from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { Sprite } from './Sprite';
import { StoryFlag } from './State/PlayerState';

export enum GameObjectId {
  Hero = 'hero',
  Beth = 'beth',
  Erio = 'erio',
  Npc3 = 'npc3',
  PizzaStone = 'pizzaStone',
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export interface GameObjectBehaviour {
  type: OverworldEventAction.Stand | OverworldEventAction.Walk;
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
  src?: string;
  direction?: Direction;
  behaviourLoop?: GameObjectBehaviour[];
  talking?: Array<{
    required?: StoryFlag[];
    events: OverworldEventPayload[];
  }>;
  storyFlag?: StoryFlag;
}

export class GameObject {
  id: GameObjectId;
  x: number;
  y: number;
  sprite: Sprite;
  direction: Direction;
  isMounted: boolean;
  behaviourLoop: GameObjectBehaviour[];
  behaviourLoopIndex: number;
  isStanding: boolean;
  talking?: Array<{
    required?: StoryFlag[];
    events: OverworldEventPayload[];
  }>;
  storyFlag?: StoryFlag;

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
    const eventConfig: OverworldEventWalkPayload | OverworldEventStandPayload =
      {
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
