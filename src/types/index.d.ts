import { MapName, OverworldMapConfig } from '../OverworldMap';
import {
  Action,
  ActionKey,
  AnimationActionPayload,
} from '../constants/ACTIONS';
import { BattleAnimationKey } from '../constants/BATTLE_ANIMATIONS';
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
  }
}
