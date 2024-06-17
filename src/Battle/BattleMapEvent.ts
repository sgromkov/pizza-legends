import { EventPayload, OverworldEvent } from '../OverworldEvent';
import { OverworldMap } from '../OverworldMap';
import { EnemyKey } from '../constants/ENEMIES';
import { Battle } from './Battle';

export enum BattleMapAction {
  Battle = 'battle',
}

export interface BattleMapEventPayload {
  type: BattleMapAction;
  enemyId: EnemyKey;
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
      enemy: window.ENEMIES[this.event.enemyId],
      onComplete: () => {
        resolve();
      },
    });

    battle.init(document.querySelector('.game-container'));
  }
}
