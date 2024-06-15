import { Combatant } from '../Battle/Combatant';
import { BattleAnimationKey } from './BATTLE_ANIMATIONS';

export enum ActionTargetType {
  Friendly = 'friendly',
}

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
  caster?: Combatant;
  color?: string;
}

export enum StateChangeStatusType {
  Saucy = 'saucy',
  Clumsy = 'clumsy',
}

export interface StateChangeActionPayload {
  type: ActionType.StateChange;
  damage?: number;
  recover?: number;
  onCaster?: boolean;
  status?: {
    type: StateChangeStatusType;
    expiresIn: number;
  };
  caster?: Combatant;
  target?: Combatant;
  action?: Action;
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
  SaucyStatus = 'saucyStatus',
  ClumsyStatus = 'clumsyStatus',
}

export interface Action {
  name: string;
  success: Array<ActionPayload>;
  targetType?: ActionTargetType;
  description?: string;
}

window.ACTIONS = {
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
  [ActionKey.SaucyStatus]: {
    name: 'Tomato Squeeze!',
    targetType: ActionTargetType.Friendly,
    success: [
      {
        type: ActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: ActionType.StateChange,
        status: {
          type: StateChangeStatusType.Saucy,
          expiresIn: 3,
        },
      },
    ],
  },
  [ActionKey.ClumsyStatus]: {
    name: 'Olive Oil',
    success: [
      {
        type: ActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: ActionType.Animation,
        animation: BattleAnimationKey.Glob,
        color: '#dafd2a',
      },
      {
        type: ActionType.StateChange,
        status: {
          type: StateChangeStatusType.Clumsy,
          expiresIn: 3,
        },
      },
      {
        type: ActionType.TextMessage,
        text: '{TARGET} is slipping all around!',
      },
    ],
  },
};
