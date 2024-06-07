import { BattleAnimationKey } from '../Battle/BattleAnimations';
import { Combatant } from '../Battle/Combatant';

export enum ActionType {
  TextMessage = 'textMessage',
  Animation = 'animation',
  StateChange = 'stateChange',
  SubmissionMenu = 'submissionMenu',
}

export interface TextMessageActionPayload {
  type: ActionType.TextMessage;
  text: string;
  caster?: Combatant;
  target?: Combatant;
  action?: Action;
}

export interface AnimationActionPayload {
  type: ActionType.Animation;
  animation: BattleAnimationKey;
  caster?: Combatant
}

export interface StateChangeActionPayload {
  type: ActionType.StateChange;
  damage: number;
  caster?: Combatant;
  target?: Combatant;
}

export interface SubmissionMenuActionPayload {
  type: ActionType.SubmissionMenu;
  caster: Combatant;
  enemy: Combatant;
}

export type ActionPayload =
  | TextMessageActionPayload
  | AnimationActionPayload
  | StateChangeActionPayload
  | SubmissionMenuActionPayload;

export enum ActionKey {
  Damage1 = 'damage1',
}

export interface Action {
  name: string;
  success: Array<ActionPayload>;
}

export const ACTIONS: Record<ActionKey, Action> = {
  [ActionKey.Damage1]: {
    name: 'Whomp!',
    success: [
      {
        type: ActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: ActionType.Animation,
        animation: BattleAnimationKey.Spin,
      },
      {
        type: ActionType.StateChange,
        damage: 10,
      },
    ],
  },
};
