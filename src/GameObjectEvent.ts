import { OverworldEvent } from './OverworldEvent';
import {
  GameObjectAction,
  GameObjectBehaviour,
  GameObjectName,
} from './GameObject';
import { EventName } from './utils';
import { OverworldMap } from './OverworldMap';

export interface GameObjectEventPayload extends GameObjectBehaviour {
  who: GameObjectName;
}

interface Config {
  map: OverworldMap;
  event: GameObjectEventPayload;
}

export class GameObjectEvent extends OverworldEvent {
  event: GameObjectEventPayload;

  constructor(config: Config) {
    super(config);
  }

  stand(resolve: Function): void {
    const person = this.map.gameObjects[this.event.who];

    person.startBehaviour(
      {
        map: this.map,
      },
      {
        type: GameObjectAction.Stand,
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
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
    const person = this.map.gameObjects[this.event.who];

    person.startBehaviour(
      {
        map: this.map,
      },
      {
        type: GameObjectAction.Walk,
        direction: this.event.direction,
        retry: true,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener(
          EventName.PersonWalkingComplete,
          completeHandler
        );

        resolve();
      }
    };

    document.addEventListener(EventName.PersonWalkingComplete, completeHandler);
  }
}
