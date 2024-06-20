import { DirectionInput } from './DirectionInput';
import { Direction, GameObject, GameObjectName } from './GameObject';
import { Hud } from './Hud';
import { KeyPressListener } from './KeyPressListener';
import { OverworldEventAction } from './OverworldEvent';
import { MapName, OverworldMap, OverworldMapConfig } from './OverworldMap';
import { EnemyKey } from './constants/ENEMIES';
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
        if (e.detail.whoId === GameObjectName.Hero) {
          // Hero's position has changed
          this.map.checkForFootstepCutscene();
        }
      }
    );
  }

  startMap(mapConfig: OverworldMapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.hud = new Hud();
    this.hud.init(document.querySelector('.game-container'));

    this.startMap(window.OVERWORLD_MAPS[MapName.DemoRoom]);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { type: OverworldEventAction.Battle, enemyId: EnemyKey.Beth },
    // ]);
  }
}
