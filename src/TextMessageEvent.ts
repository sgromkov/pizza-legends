import { GameObjectName } from './GameObject';
import { OverworldEvent } from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { TextMessage } from './TextMessage';
import { getOppositeDirection } from './utils';

export enum TextMessageAction {
  TextMessage = 'textMessage',
}

export interface TextMesssageEventPayload {
  type: TextMessageAction;
  text: string;
  faceHero?: GameObjectName;
}

interface Config {
  map: OverworldMap;
  event: TextMesssageEventPayload;
}

export class TextMessageEvent extends OverworldEvent {
  event: TextMesssageEventPayload;

  constructor(config: Config) {
    super(config);
  }

  textMessage(resolve: Function): void {
    if (this.event.faceHero) {
      const gameObject = this.map.gameObjects[this.event.faceHero];

      gameObject.direction = getOppositeDirection(
        this.map.gameObjects[GameObjectName.Hero].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector('.game-container'));
  }
}
