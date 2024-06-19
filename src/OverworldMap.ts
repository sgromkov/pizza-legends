import {
  BattleMapAction,
  BattleMapEvent,
  BattleMapEventPayload,
} from './Battle/BattleMapEvent';
import {
  Direction,
  GameObject,
  GameObjectAction,
  GameObjectName,
} from './GameObject';
import { GameObjectEvent, GameObjectEventPayload } from './GameObjectEvent';
import { MapAction, MapEvent, MapEventPayload } from './MapEvent';
import { Overworld } from './Overworld';
import { EventPayload, OverworldEvent } from './OverworldEvent';
import { PauseAction, PauseEvent, PauseEventPayload } from './PauseEvent';
import { Person } from './Person';
import {
  TextMessageAction,
  TextMessageEvent,
  TextMesssageEventPayload,
} from './TextMessageEvent';
import { nextPosition, withGrid } from './utils';

export enum MapName {
  DemoRoom = 'DemoRoom',
  Kitchen = 'Kitchen',
}

export interface OverworldMapConfig {
  gameObjects: Partial<Record<GameObjectName, GameObject | Person>>;
  lowerSrc: string;
  upperSrc: string;
  walls?: Record<string, boolean>;
  cutsceneSpaces?: Record<
    string,
    Array<{
      events: EventPayload[];
    }>
  >;
}

export class OverworldMap {
  overworld: Overworld;
  gameObjects: Partial<Record<GameObjectName, GameObject | Person>>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: Record<string, boolean>;
  cutsceneSpaces: Record<
    string,
    Array<{
      events: EventPayload[];
    }>
  >;
  isCutscenePlaying: boolean;
  isPaused: boolean;

  constructor(config: OverworldMapConfig) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(
    ctx: CanvasRenderingContext2D,
    cameraPerson: GameObject | Person
  ): void {
    ctx.drawImage(
      this.lowerImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(
    ctx: CanvasRenderingContext2D,
    cameraPerson: GameObject | Person
  ): void {
    ctx.drawImage(
      this.upperImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(
    currentX: number,
    currentY: number,
    direction: Direction
  ): boolean {
    const { x, y } = nextPosition(currentX, currentY, direction);

    return this.walls[`${x},${y}`] || false;
  }

  mountObjects(): void {
    Object.keys(this.gameObjects).forEach((key: GameObjectName) => {
      const gameObject = this.gameObjects[key];

      gameObject.id = key;
      gameObject.mount(this);
    });
  }

  async startCutscene(events: EventPayload[]): Promise<void> {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
      let eventHandler: OverworldEvent;

      switch (events[i].type) {
        case TextMessageAction.TextMessage:
          eventHandler = new TextMessageEvent({
            event: events[i] as TextMesssageEventPayload,
            map: this,
          });
          break;
        case GameObjectAction.Stand:
        case GameObjectAction.Walk:
          eventHandler = new GameObjectEvent({
            event: events[i] as GameObjectEventPayload,
            map: this,
          });
          break;
        case MapAction.ChangeMap:
          eventHandler = new MapEvent({
            event: events[i] as MapEventPayload,
            map: this,
          });
          break;
        case BattleMapAction.Battle:
          eventHandler = new BattleMapEvent({
            event: events[i] as BattleMapEventPayload,
            map: this,
          });
          break;
        case PauseAction.Pause:
          eventHandler = new PauseEvent({
            event: events[i] as PauseEventPayload,
            map: this,
          });
          break;
      }

      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behaviour:
    Object.values(this.gameObjects).forEach((gameObject) =>
      gameObject.doBehaviourEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects[GameObjectName.Hero];
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects[GameObjectName.Hero];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x: number, y: number): void {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x: number, y: number): void {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX: number, wasY: number, direction: Direction): void {
    const { x, y } = nextPosition(wasX, wasY, direction);

    this.removeWall(wasX, wasY);
    this.addWall(x, y);
  }
}
