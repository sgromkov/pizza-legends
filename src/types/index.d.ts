import { MapName, OverworldMapConfig } from '../OverworldMap';
import { PlayerState } from '../State/PlayerState';
import {
  BattleAction,
  BattleActionId,
  BattleActionAnimationPayload,
} from '../constants/BATLE_ACTIONS';
import { BattleAnimationId } from '../constants/BATTLE_ANIMATIONS';
import { Enemy, EnemyId } from '../constants/ENEMIES';
import { Pizza, PizzaId } from '../constants/PIZZAS';

export {};

declare global {
  interface Window {
    OVERWORLD_MAPS: Record<MapName, OverworldMapConfig>;
    BATTLE_ANIMATIONS: Record<
      BattleAnimationId,
      (
        payload: BattleActionAnimationPayload,
        onComplete: Function
      ) => Promise<void>
    >;
    BATLE_ACTIONS: Record<BattleActionId, BattleAction>;
    PIZZAS: Record<PizzaId, Pizza>;
    ENEMIES: Record<EnemyId, Enemy>;
    playerState: PlayerState;
  }
}
