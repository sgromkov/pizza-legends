import { Combatant, TeamType } from '../Battle/Combatant';
import { BattleAnimationKey } from './BATTLE_ANIMATIONS';

export enum ActionTargetType {
  Friendly = 'friendly',
}

export enum ActionType {
  TextMessage = 'textMessage',
  Animation = 'animation',
  StateChange = 'stateChange',
  SubmissionMenu = 'submissionMenu',
  Replace = 'replace',
  ReplacementMenu = 'replacementMenu',
  GiveXp = 'giveXp',
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

export interface ReplaceActionPayload {
  type: ActionType.Replace;
  replacement: Combatant;
}

export interface ReplacementMenuActionPayload {
  type: ActionType.ReplacementMenu;
  team: TeamType;
}

export interface GiveXpActionPayload {
  type: ActionType.GiveXp;
  xp: number;
  combatant: Combatant;
}

export type ActionPayload =
  | TextMessageActionPayload
  | AnimationActionPayload
  | StateChangeActionPayload
  | SubmissionMenuActionPayload
  | ReplaceActionPayload
  | ReplacementMenuActionPayload
  | GiveXpActionPayload;

export enum ActionKey {
  Damage1 = 'damage1',
  SaucyStatus = 'saucyStatus',
  ClumsyStatus = 'clumsyStatus',
  ItemRecoverStatus = 'item_recoverStatus',
  ItemRecoverHp = 'item_revoverHp',
}

export interface Action {
  name: string;
  success: Array<ActionPayload>;
  targetType?: ActionTargetType;
  description?: string;
}

export interface ActionItem {
  actionId: ActionKey;
  instanceId: string;
  team?: TeamType;
}

window.ACTIONS = {
  [ActionKey.Damage1]: {
    name: 'Whomp!',
    description: 'Pillowy punch of dough',
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
    description: 'Applies the Saucy status',
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
    description: 'Slippery mess of deliciousness',
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
  // Items:
  [ActionKey.ItemRecoverStatus]: {
    name: 'Heating Lamp',
    description: 'Clear status to your character',
    targetType: ActionTargetType.Friendly,
    success: [
      {
        type: ActionType.TextMessage,
        text: '{CASTER} uses a {ACTION}!',
      },
      {
        type: ActionType.StateChange,
        status: null,
      },
      {
        type: ActionType.TextMessage,
        text: 'Feeling fresh!',
      },
    ],
  },
  [ActionKey.ItemRecoverHp]: {
    name: 'Parmesan',
    description: 'Recover 10 hp to your character',
    targetType: ActionTargetType.Friendly,
    success: [
      {
        type: ActionType.TextMessage,
        text: '{CASTER} sprinkles on some {ACTION}!',
      },
      {
        type: ActionType.StateChange,
        recover: 10,
      },
      {
        type: ActionType.TextMessage,
        text: '{CASTER} recovers HP!',
      },
    ],
  },
};
