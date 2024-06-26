import { Battle } from './Battle/Battle';
import { CraftingMenu } from './CraftingMenu';
import { Direction, GameObjectBehaviour, GameObjectId } from './GameObject';
import { MapId, OverworldMap } from './OverworldMap';
import { PauseMenu } from './PauseMenu';
import { SceneTransition } from './SceneTransition';
import { StoryFlag } from './State/PlayerState';
import { TextMessage } from './TextMessage';
import { EnemyId } from './constants/ENEMIES';
import { PizzaId } from './constants/PIZZAS';
import { EventName, getOppositeDirection } from './utils';

export enum OverworldEventAction {
  TextMessage = 'textMessage',
  Walk = 'walk',
  Stand = 'stand',
  ChangeMap = 'changeMap',
  Battle = 'battle',
  Pause = 'pause',
  AddStoryFlag = 'addStoryFlag',
  CraftingMenu = 'craftingMenu',
}

export interface OverworldEventTextMesssagePayload {
  type: OverworldEventAction.TextMessage;
  text: string;
  faceHero?: GameObjectId;
}

export interface OverworldEventStandPayload {
  type: OverworldEventAction.Stand;
  who: GameObjectId;
  direction: Direction;
  time?: number;
}

export interface OverworldEventWalkPayload {
  type: OverworldEventAction.Walk;
  who: GameObjectId;
  direction: Direction;
  time?: number;
  retry?: boolean;
}

export interface OverworldEventChangeMapPayload {
  type: OverworldEventAction.ChangeMap;
  map: MapId;
  x: number;
  y: number;
  direction: Direction;
}

export interface OverworldEventBattlePayload {
  type: OverworldEventAction.Battle;
  enemyId: EnemyId;
}

export interface OverworldEventPausePayload {
  type: OverworldEventAction.Pause;
}
export interface OverworldEventAddStoryFlagPayload {
  type: OverworldEventAction.AddStoryFlag;
  flag: StoryFlag;
}

export interface OverworldEventCraftingMenuPayload {
  type: OverworldEventAction.CraftingMenu;
  pizzas: PizzaId[];
}

export type OverworldEventPayload =
  | OverworldEventTextMesssagePayload
  | OverworldEventStandPayload
  | OverworldEventWalkPayload
  | OverworldEventChangeMapPayload
  | OverworldEventBattlePayload
  | OverworldEventPausePayload
  | OverworldEventAddStoryFlagPayload
  | OverworldEventCraftingMenuPayload;

export enum OverworldEventBattleResult {
  WonBattle = 'WON_BATTLE',
  LostBattle = 'LOST_BATTLE',
}

interface Config {
  map: OverworldMap;
  event: OverworldEventPayload;
}

export class OverworldEvent {
  map: OverworldMap;
  event: OverworldEventPayload;

  constructor(config: Config) {
    this.map = config.map;
    this.event = config.event;
  }

  textMessage(resolve: Function): void {
    const event = this.event as OverworldEventTextMesssagePayload;

    if (event.faceHero) {
      const gameObject = this.map.gameObjects[event.faceHero];

      gameObject.direction = getOppositeDirection(
        this.map.gameObjects[GameObjectId.Hero].direction
      );
    }

    const message = new TextMessage({
      text: event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector('.game-container'));
  }

  stand(resolve: Function): void {
    const event = this.event as OverworldEventStandPayload;
    const person = this.map.gameObjects[event.who];

    person.startBehaviour(
      {
        map: this.map,
      },
      {
        type: OverworldEventAction.Stand,
        direction: event.direction,
        time: event.time,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === event.who) {
        document.removeEventListener(
          EventName.PersonStandComplete,
          completeHandler
        );

        resolve();
      }
    };

    document.addEventListener(EventName.PersonStandComplete, completeHandler);
  }

  walk(resolve: Function): void {
    const event = this.event as OverworldEventWalkPayload;
    const person = this.map.gameObjects[event.who];

    person.startBehaviour(
      {
        map: this.map,
      },
      {
        type: OverworldEventAction.Walk,
        direction: event.direction,
        retry: true,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === event.who) {
        document.removeEventListener(
          EventName.PersonWalkingComplete,
          completeHandler
        );

        resolve();
      }
    };

    document.addEventListener(EventName.PersonWalkingComplete, completeHandler);
  }

  changeMap(resolve: Function) {
    // Deactivate old objects:
    Object.values(this.map.gameObjects).forEach((obj) => {
      obj.isMounted = false;
    });

    const event = this.event as OverworldEventChangeMapPayload;
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap(window.OVERWORLD_MAPS[event.map], {
        x: event.x,
        y: event.y,
        direction: event.direction,
      });
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve: Function) {
    const event = this.event as OverworldEventBattlePayload;
    const battle = new Battle({
      enemy: window.ENEMIES[event.enemyId],
      onComplete: (isPlayerWin: boolean) => {
        resolve(
          isPlayerWin
            ? OverworldEventBattleResult.WonBattle
            : OverworldEventBattleResult.LostBattle
        );
      },
    });

    battle.init(document.querySelector('.game-container'));
  }

  pause(resolve: Function) {
    this.map.isPaused = true;

    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
    });

    menu.init(document.querySelector('.game-container'));
  }

  addStoryFlag(resolve: Function) {
    const event = this.event as OverworldEventAddStoryFlagPayload;

    window.playerState.storyFlags[event.flag] = true;

    resolve();
  }

  craftingMenu(resolve: Function) {
    const event = this.event as OverworldEventCraftingMenuPayload;
    const menu = new CraftingMenu({
      pizzas: event.pizzas,
      onComplete: () => {
        resolve();
      },
    });

    menu.init(document.querySelector('.game-container'));
  }

  async init(): Promise<void | OverworldEventBattleResult> {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
