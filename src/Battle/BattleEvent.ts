import { TextMessage } from '../TextMessage';
import {
  ActionPayload,
  ActionTargetType,
  AnimationActionPayload,
  ReplaceActionPayload,
  ReplacementMenuActionPayload,
  StateChangeActionPayload,
  SubmissionMenuActionPayload,
  TextMessageActionPayload,
} from '../constants/ACTIONS';
import { wait } from '../utils';
import { Battle } from './Battle';
import { Combatant } from './Combatant';
import { ReplacementMenu } from './ReplacementMenu';
// import { BATTLE_ANIMATIONS } from './BattleAnimations';
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

    let who = payload.onCaster ? payload.caster : payload.target;

    if (payload.damage) {
      // Modify the target to have less HP:
      payload.target.update({
        hp: payload.target.hp - payload.damage,
      });

      // Start blinking:
      payload.target.pizzaElement.classList.add('battle-damage-blink');
    }

    if (payload.recover) {
      let newHp = who.hp + payload.recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({
        hp: newHp,
      });
    }

    if (payload.status) {
      who.update({
        status: { ...payload.status },
      });
    }
    if (payload.status === null) {
      who.update({
        status: null,
      });
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
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter(
        (combatant) => {
          return (
            combatant.id !== payload.caster.id &&
            combatant.team === payload.caster.team &&
            combatant.hp > 0
          );
        }
      ),
      onComplete: (submission: SubmissionMenuResultPayload) => {
        // submission { what move to use, who to use it on }
        resolve(submission);
      },
    });
    menu.init(this.battle.element);
  }

  replacementMenu(resolve: Function) {
    const payload = this.payload as ReplacementMenuActionPayload;
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter(
        (combatant) => {
          return combatant.team === payload.team && combatant.hp > 0;
        }
      ),
      onComplete: (replacement: Combatant) => {
        resolve(replacement);
      },
    });
    menu.init(this.battle.element);
  }

  async replace(resolve: Function) {
    const payload = this.payload as ReplaceActionPayload;
    const { replacement } = payload;

    // Clear out the old combatant:
    const prevCombatant: Combatant =
      this.battle.combatants[this.battle.activeCombatants[replacement.team]];
    this.battle.activeCombatants[replacement.team] = null;
    prevCombatant.update();
    await wait(400);

    // In with the new!
    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();
    await wait(400);

    resolve();
  }

  animation(resolve: Function) {
    const payload = this.payload as AnimationActionPayload;
    const fn = window.BATTLE_ANIMATIONS[payload.animation];
    fn(payload, resolve);
  }

  init(resolve: Function) {
    this[this.payload.type](resolve);
  }
}
