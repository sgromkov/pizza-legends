import { MapName, OverworldMapConfig } from '../OverworldMap';
import { PlayerState } from '../State/PlayerState';
import {
  Action,
  ActionKey,
  AnimationActionPayload,
} from '../constants/ACTIONS';
import { BattleAnimationKey } from '../constants/BATTLE_ANIMATIONS';
import { Enemy, EnemyKey } from '../constants/ENEMIES';
import { Pizza, PizzaKey } from '../constants/PIZZAS';

export {};

declare global {
  interface Window {
    OVERWORLD_MAPS: Record<MapName, OverworldMapConfig>;
    BATTLE_ANIMATIONS: Record<
      BattleAnimationKey,
      (payload: AnimationActionPayload, onComplete: Function) => Promise<void>
    >;
    ACTIONS: Record<ActionKey, Action>;
    PIZZAS: Record<PizzaKey, Pizza>;
    ENEMIES: Record<EnemyKey, Enemy>;
    playerState: PlayerState;
  }
}
