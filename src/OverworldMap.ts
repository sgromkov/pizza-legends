import { Direction, GameObject } from './GameObject';
import { BehaviourEvent, OverworldEvent } from './OverworldEvent';
import { Person } from './Person';
import { nextPosition, withGrid } from './utils';

export interface OverworldMapConfig {
  gameObjects: Record<string, GameObject | Person>;
  lowerSrc: string;
  upperSrc: string;
  walls: Record<string, boolean>;
}

export class OverworldMap {
  gameObjects: Record<string, GameObject | Person>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: Record<string, boolean>;
  isCutscenePlaying: boolean;

  constructor(config: OverworldMapConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
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
    Object.keys(this.gameObjects).forEach((key) => {
      const gameObject = this.gameObjects[key];

      gameObject.id = key;
      gameObject.mount(this);
    });
  }

  async startCutscene(events: BehaviourEvent[]) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });

      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
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
