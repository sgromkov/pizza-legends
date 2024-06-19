import { OverworldEvent } from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { PauseMenu } from './PauseMenu';

export enum PauseAction {
  Pause = 'pause',
}

export interface PauseEventPayload {
  type: PauseAction;
}

interface Config {
  map: OverworldMap;
  event: PauseEventPayload;
}

export class PauseEvent extends OverworldEvent {
  event: PauseEventPayload;

  constructor(config: Config) {
    super(config);
  }

  pause(resolve: Function) {
    this.map.isPaused = true;

    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
    });

    menu.init(document.querySelector('.game-container'));
  }
}
