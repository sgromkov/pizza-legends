import { Direction, GameObject, GameObjectId } from './GameObject';
import { Overworld } from './Overworld';
import {
  OverworldEventPayload,
  OverworldEvent,
  OverworldEventBattleResult,
} from './OverworldEvent';
import { Person } from './Person';
import { PizzaStone } from './PizzaStone';
import { StoryFlag } from './State/PlayerState';
import { nextPosition, withGrid } from './utils';

export enum MapId {
  DemoRoom = 'DemoRoom',
  Kitchen = 'Kitchen',
  Street = 'Street',
  DiningRoom = 'DiningRoom',
  Shop = 'Shop',
  StreetNorth = 'StreetNorth',
  GreenKitchen = 'GreenKitchen',
}

export interface OverworldMapConfig {
  id: MapId;
  gameObjects: Partial<Record<GameObjectId, GameObject | Person | PizzaStone>>;
  lowerSrc: string;
  upperSrc: string;
  walls?: Record<string, boolean>;
  cutsceneSpaces?: Record<
    string,
    Array<{
      disqualify?: StoryFlag[];
      events: OverworldEventPayload[];
    }>
  >;
}

export class OverworldMap {
  id: MapId;
  overworld: Overworld;
  gameObjects: Partial<Record<GameObjectId, GameObject | Person | PizzaStone>>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: Record<string, boolean>;
  cutsceneSpaces: Record<
    string,
    Array<{
      disqualify?: StoryFlag[];
      events: OverworldEventPayload[];
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
    Object.keys(this.gameObjects).forEach((id: GameObjectId) => {
      const gameObject = this.gameObjects[id];

      gameObject.id = id;
      gameObject.mount(this);
    });
  }

  async startCutscene(events: OverworldEventPayload[]): Promise<void> {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });

      const result = await eventHandler.init();

      if (result === OverworldEventBattleResult.LostBattle) {
        break;
      }
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behaviour:
    Object.values(this.gameObjects).forEach((gameObject) =>
      gameObject.doBehaviourEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects[GameObjectId.Hero];
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          return window.playerState.storyFlags[sf];
        });
      });

      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects[GameObjectId.Hero];
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
