import { EventPayload, OverworldEvent } from '../OverworldEvent';
import { OverworldMap } from '../OverworldMap';
import { Battle } from './Battle';

export enum BattleAction {
  Battle = 'battle',
}

export interface BattleEventPayload {
  type: BattleAction;
}

interface Config {
  map: OverworldMap;
  event: BattleEventPayload;
}

export class BattleEvent extends OverworldEvent {
  event: BattleEventPayload;

  constructor(config: Config) {
    super(config);
  }

  battle(resolve: Function) {
    const battle = new Battle({
      onComplete: () => {
        resolve();
      },
    });

    battle.init(document.querySelector('.game-container'));
  }
}
