import { Team } from '../Battle/Combatant';
import { wait } from '../utils';
import { AnimationActionPayload } from './ACTIONS';

export enum BattleAnimationKey {
  Spin = 'spin',
  Glob = 'glob',
}

window.BATTLE_ANIMATIONS = {
  [BattleAnimationKey.Spin]: async (
    payload: AnimationActionPayload,
    onComplete: Function
  ) => {
    const animationClassName =
      payload.caster.team === Team.Player
        ? 'battle-spin-right'
        : 'battle-spin-left';
    const element = payload.caster.pizzaElement;
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
  [BattleAnimationKey.Glob]: async (
    payload: AnimationActionPayload,
    onComplete: Function
  ) => {
    const animationClassName =
      payload.caster.team === Team.Player
        ? 'battle-glob-right'
        : 'battle-glob-left';
    const element = document.createElement('div');
    element.classList.add('glob-orb');
    element.classList.add(animationClassName);

    element.innerHTML = `
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${payload.color}" />
      </svg>
      `;

    // Remove class when animantion is fully complete:
    element.addEventListener('animationend', () => {
      element.remove();
    });

    // Ass to scene:
    document.querySelector('.battle').appendChild(element);

    await wait(820);
    onComplete();
  },
};
