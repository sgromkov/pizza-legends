import { AnimationActionPayload } from '../content/actions';
import { wait } from '../utils';
import { Combatant, Team } from './Combatant';

export enum BattleAnimationKey {
  Spin = 'spin',
}

export const BATTLE_ANIMATIONS: Record<
  BattleAnimationKey,
  (payload: AnimationActionPayload, onComplete: Function) => Promise<void>
> = {
  [BattleAnimationKey.Spin]: async (
    payload: AnimationActionPayload,
    onComplete: Function
  ) => {
    const element = payload.caster.pizzaElement;
    const animationClassName =
      payload.caster.team === Team.Player
        ? 'battle-spin-right'
        : 'battle-spin-left';
    element.classList.add(animationClassName);

    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(animationClassName);
      },
      { once: true }
    );

    // Continue battle cycle right around the pizzas collide:
    await wait(100);
    onComplete();
  },
};
