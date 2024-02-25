import { GameObjectAction, GameObjectBehaviour } from './GameObject';
import { OverworldMap } from './OverworldMap';
import { TextMessage } from './TextMessage';
import { EventName } from './utils';

export interface EventPayload {
  type: string;
  [key: string]: any;
}

interface Config {
  map: OverworldMap;
  event: EventPayload;
}

export class OverworldEvent {
  map: OverworldMap;
  event: EventPayload;

  constructor(config: Config) {
    this.map = config.map;
    this.event = config.event;
  }

  async init(): Promise<void> {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
