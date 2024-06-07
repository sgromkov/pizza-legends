import { ACTIONS, Action } from '../content/actions';
import { Combatant } from './Combatant';

export interface SubmissionMenuResultPayload {
  action: Action;
  target: Combatant;
}

export class SubmissionMenu {
  caster: Combatant;
  enemy: Combatant;
  onComplete: (SubmissionMenuResultPayload) => any;

  constructor({
    caster,
    enemy,
    onComplete,
  }: {
    caster: Combatant;
    enemy: Combatant;
    onComplete: (SubmissionMenuResultPayload) => any;
  }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  decide() {
    this.onComplete({
      action: ACTIONS[this.caster.actions[0]],
      target: this.enemy,
    });
  }

  init(container: HTMLElement) {
    this.decide();
  }
}
