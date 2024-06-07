import { TextMessage } from '../TextMessage';
import {
  ActionPayload,
  AnimationActionPayload,
  StateChangeActionPayload,
  SubmissionMenuActionPayload,
  TextMessageActionPayload,
} from '../content/actions';
import { wait } from '../utils';
import { Battle } from './Battle';
import { BATTLE_ANIMATIONS } from './BattleAnimations';
import { SubmissionMenu, SubmissionMenuResultPayload } from './SubmissionMenu';

export class BattleEvent {
  payload: ActionPayload;
  battle: Battle;

  constructor(payload: ActionPayload, battle: Battle) {
    this.payload = payload;
    this.battle = battle;
  }

  textMessage(resolve: Function) {
    const payload = this.payload as TextMessageActionPayload;

    const text = payload.text
      .replace('{CASTER}', payload.caster?.name)
      .replace('{TARGET}', payload.target?.name)
      .replace('{ACTION}', payload.action?.name);

    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      },
    });
    message.init(this.battle.element);
  }

  async stateChange(resolve: Function) {
    const payload = this.payload as StateChangeActionPayload;

    if (payload.damage) {
      // Modify the target to have less HP:
      payload.target.update({
        hp: payload.target.hp - payload.damage,
      });

      // Start blinking:
      payload.target.pizzaElement.classList.add('battle-damage-blink');
    }

    // Wait a little kit:
    await wait(600);

    // Stop blinking:
    payload.target.pizzaElement.classList.remove('battle-damage-blink');

    resolve();
  }

  submissionMenu(resolve: Function) {
    const payload = this.payload as SubmissionMenuActionPayload;
    const menu = new SubmissionMenu({
      caster: payload.caster,
      enemy: payload.enemy,
      onComplete: (submission: SubmissionMenuResultPayload) => {
        // submission { what move to use, who to use it on }
        resolve(submission);
      },
    });
    menu.init(this.battle.element);
  }

  animation(resolve: Function) {
    const payload = this.payload as AnimationActionPayload;
    const fn = BATTLE_ANIMATIONS[payload.animation];
    fn(payload, resolve);
  }

  init(resolve: Function) {
    this[this.payload.type](resolve);
  }
}
