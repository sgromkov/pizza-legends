import { MapName, OverworldMapConfig } from '../OverworldMap';
import { PlayerState } from '../State/PlayerState';
import {
  Action,
  ActionId,
  AnimationActionPayload,
} from '../constants/ACTIONS';
import { BattleAnimationId } from '../constants/BATTLE_ANIMATIONS';
import { Enemy, EnemyId } from '../constants/ENEMIES';
import { Pizza, PizzaId } from '../constants/PIZZAS';

export {};

declare global {
  interface Window {
    OVERWORLD_MAPS: Record<MapName, OverworldMapConfig>;
    BATTLE_ANIMATIONS: Record<
      BattleAnimationId,
      (payload: AnimationActionPayload, onComplete: Function) => Promise<void>
    >;
    ACTIONS: Record<ActionId, Action>;
    PIZZAS: Record<PizzaId, Pizza>;
    ENEMIES: Record<EnemyId, Enemy>;
    playerState: PlayerState;
  }
}
