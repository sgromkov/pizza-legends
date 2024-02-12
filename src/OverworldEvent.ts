import { GameObjectAction, GameObjectBehaviour } from './GameObject';
import { OverworldMap } from './OverworldMap';
import { eventName } from './utils';

export interface BehaviourEvent extends GameObjectBehaviour {
  who: string;
}

interface Config {
  map: OverworldMap;
  event: BehaviourEvent;
}

export class OverworldEvent {
  map: OverworldMap;
  event: BehaviourEvent;

  constructor(config: Config) {
    this.map = config.map;
    this.event = config.event;
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
          eventName.PersonStandComplete,
          completeHandler
        );

        resolve();
      }
    };

    document.addEventListener(eventName.PersonStandComplete, completeHandler);
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
          eventName.PersonWalkingComplete,
          completeHandler
        );

        resolve();
      }
    };

    document.addEventListener(eventName.PersonWalkingComplete, completeHandler);
  }

  async init(): Promise<void> {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
