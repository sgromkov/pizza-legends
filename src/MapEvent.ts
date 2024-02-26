import { OverworldEvent } from './OverworldEvent';
import { MapName, OverworldMap } from './OverworldMap';
import { SceneTransition } from './SceneTransition';

export enum MapAction {
  ChangeMap = 'changeMap',
}

export interface MapEventPayload {
  type: MapAction;
  map: MapName;
}

interface Config {
  map: OverworldMap;
  event: MapEventPayload;
}

export class MapEvent extends OverworldEvent {
  event: MapEventPayload;

  constructor(config: Config) {
    super(config);
  }

  changeMap(resolve: Function) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap(window.OVERWORLD_MAPS[this.event.map]);
      resolve();

      sceneTransition.fadeOut();
    });
  }
}
