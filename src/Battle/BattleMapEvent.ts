import { EventPayload, OverworldEvent } from '../OverworldEvent';
import { OverworldMap } from '../OverworldMap';
import { Battle } from './Battle';

export enum BattleMapAction {
  Battle = 'battle',
}

export interface BattleMapEventPayload {
  type: BattleMapAction;
}

interface Config {
  map: OverworldMap;
  event: BattleMapEventPayload;
}

export class BattleMapEvent extends OverworldEvent {
  event: BattleMapEventPayload;

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
