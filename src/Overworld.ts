import { DirectionInput } from './DirectionInput';
import { Direction, GameObject, GameObjectId } from './GameObject';
import { Hud } from './Hud';
import { KeyPressListener } from './KeyPressListener';
import { OverworldEventAction } from './OverworldEvent';
import { MapId, OverworldMap, OverworldMapConfig } from './OverworldMap';
import { Progress } from './Progress';
import { TitleScreen } from './TitleScreen';
import { EnemyId } from './constants/ENEMIES';
import { EventName } from './utils';

interface Config {
  element: HTMLElement;
}

export class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: OverworldMap;
  directionInput: DirectionInput;
  hud: Hud;
  progress: Progress;
  titleScreen: TitleScreen;

  constructor(config: Config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // Clear off the canvas:
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish the camera person:
      const cameraPerson = this.map.gameObjects.hero;

      // Update all objects:
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw Lower Layer:
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw Game Objects:
      Object.values(this.map.gameObjects)
        // Set correct z-indexes:
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw Upper Layer:
      this.map.drawUpperImage(this.ctx, cameraPerson);

      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();
        });
      }
    };

    step();
  }

  bindActionInput() {
    new KeyPressListener('Enter', () => {
      // Is there a person here to talk?
      this.map.checkForActionCutscene();
    });

    new KeyPressListener('Escape', () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          {
            type: OverworldEventAction.Pause,
          },
        ]);
      }
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener(
      EventName.PersonWalkingComplete,
      (e: CustomEvent) => {
        if (e.detail.whoId === GameObjectId.Hero) {
          // Hero's position has changed
          this.map.checkForFootstepCutscene();
        }
      }
    );
  }

  startMap(
    mapConfig: OverworldMapConfig,
    initialHeroState: {
      x: number;
      y: number;
      direction: Direction;
    } = null
  ) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    if (initialHeroState) {
      this.map.removeWall(
        this.map.gameObjects.hero.x,
        this.map.gameObjects.hero.y
      );

      this.map.gameObjects.hero.x = initialHeroState.x;
      this.map.gameObjects.hero.y = initialHeroState.y;
      this.map.gameObjects.hero.direction = initialHeroState.direction;

      this.map.addWall(
        this.map.gameObjects.hero.x,
        this.map.gameObjects.hero.y
      );
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  async init() {
    const container: HTMLElement = document.querySelector('.game-container');

    // Create a new Progress tracker:
    this.progress = new Progress();

    // Show the title screen:
    this.titleScreen = new TitleScreen({
      progress: this.progress,
    });
    const useSaveFile = await this.titleScreen.init(container);

    // Potentially load save data:
    let initialHeroState: {
      x: number;
      y: number;
      direction: Direction;
    } = null;

    if (useSaveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      };
    }

    // Load the HUD:
    this.hud = new Hud();
    this.hud.init(container);

    // Start the first map:
    this.startMap(window.OVERWORLD_MAPS[this.progress.mapId], initialHeroState);

    // Create controlls:
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Kick off the game:
    this.startGameLoop();

    // this.map.startCutscene([
    //   { type: OverworldEventAction.Battle, enemyId: EnemyKey.Beth },
    // ]);
  }
}
