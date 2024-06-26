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
  DemoRoomNpc1 = 'DemoRoomNpc1',
  DemoRoomNpc2 = 'DemoRoomNpc2',
  DemoRoomPizzaStone = 'DemoRoomPizzaStone',
  KitchenNpc1 = 'KitchenNpc1',
  KitchenNpc2 = 'KitchenNpc2',
  StreetNpc1 = 'StreetNpc1',
  StreetNpc2 = 'StreetNpc2',
  StreetNpc3 = 'StreetNpc3',
  ShopNpc1 = 'ShopNpc1',
  ShopNpc2 = 'ShopNpc2',
  ShopPizzaStone = 'ShopPizzaStone',
  GreenKitchenNpc1 = 'GreenKitchenNpc1',
  GreenKitchenNpc2 = 'GreenKitchenNpc2',
  GreenKitchenBoss = 'GreenKitchenBoss',
  StreetNorthNpc1 = 'StreetNorthNpc1',
  StreetNorthNpc2 = 'StreetNorthNpc2',
  StreetNorthNpc3 = 'StreetNorthNpc3',
  StreetNorthPizzaStone = 'StreetNorthPizzaStone',
  DiningRoomNpc1 = 'DiningRoomNpc1',
  DiningRoomNpc2 = 'DiningRoomNpc2',
  DiningRoomNpc3 = 'DiningRoomNpc3',
  DiningRoomNpc4 = 'DiningRoomNpc4',
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

export enum GameObjetcType {
  Person = 'Person',
  PizzaStone = 'PizzaStone',
}

export interface GameObjectConfig {
  id?: GameObjectId;
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
  type: GameObjetcType;
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
  retryTimeout: NodeJS.Timeout;

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

    // These happen once on map startup:
    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map: OverworldMap): void {
    this.isMounted = true;

    // If we have a behaviour, kick off after a short delay:
    setTimeout(() => {
      this.doBehaviourEvent(map);
    }, 10);
  }

  update(state: ActionState): void {}

  startBehaviour(state: ActionState, behaviour: GameObjectBehaviour): void {}

  async doBehaviourEvent(map: OverworldMap): Promise<void> {
    if (this.behaviourLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }

      this.retryTimeout = setTimeout(() => {
        this.doBehaviourEvent(map);
      }, 1000);

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
