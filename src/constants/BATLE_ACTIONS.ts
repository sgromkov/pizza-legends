import { Combatant, TeamType } from '../Battle/Combatant';
import { BattleAnimationId } from './BATTLE_ANIMATIONS';

export enum BattleActionTargetType {
  Friendly = 'friendly',
}

export enum BattleActionType {
  TextMessage = 'textMessage',
  Animation = 'animation',
  StateChange = 'stateChange',
  SubmissionMenu = 'submissionMenu',
  Replace = 'replace',
  ReplacementMenu = 'replacementMenu',
  GiveXp = 'giveXp',
}

export interface BattleActionTextMessagePayload {
  type: BattleActionType.TextMessage;
  text: string;
  caster?: Combatant;
  target?: Combatant;
  action?: BattleAction;
}

export interface BattleActionAnimationPayload {
  type: BattleActionType.Animation;
  animation: BattleAnimationId;
  caster?: Combatant;
  color?: string;
}

export enum StateChangeStatusType {
  Saucy = 'saucy',
  Clumsy = 'clumsy',
}

export interface BattleActionStateChangePayload {
  type: BattleActionType.StateChange;
  damage?: number;
  recover?: number;
  onCaster?: boolean;
  status?: {
    type: StateChangeStatusType;
    expiresIn: number;
  };
  caster?: Combatant;
  target?: Combatant;
  action?: BattleAction;
}

export interface BattleActionSubmissionMenuPayload {
  type: BattleActionType.SubmissionMenu;
  caster: Combatant;
  enemy: Combatant;
}

export interface BattleActionReplacePayload {
  type: BattleActionType.Replace;
  replacement: Combatant;
}

export interface BattleActionReplacementMenuPayload {
  type: BattleActionType.ReplacementMenu;
  team: TeamType;
}

export interface BattleActionGiveXpPayload {
  type: BattleActionType.GiveXp;
  xp: number;
  combatant: Combatant;
}

export type BattleActionPayload =
  | BattleActionTextMessagePayload
  | BattleActionAnimationPayload
  | BattleActionStateChangePayload
  | BattleActionSubmissionMenuPayload
  | BattleActionReplacePayload
  | BattleActionReplacementMenuPayload
  | BattleActionGiveXpPayload;

export enum BattleActionId {
  Damage1 = 'damage1',
  SaucyStatus = 'saucyStatus',
  ClumsyStatus = 'clumsyStatus',
  ItemRecoverStatus = 'item_recoverStatus',
  ItemRecoverHp = 'item_recoverHp',
}

export interface BattleAction {
  name: string;
  success: Array<BattleActionPayload>;
  targetType?: BattleActionTargetType;
  description?: string;
}

export interface BattleActionItem {
  actionId: BattleActionId;
  instanceId: string;
  team?: TeamType;
}

window.BATLE_ACTIONS = {
  [BattleActionId.Damage1]: {
    name: 'Whomp!',
    description: 'Pillowy punch of dough',
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: BattleActionType.Animation,
        animation: BattleAnimationId.Spin,
      },
      {
        type: BattleActionType.StateChange,
        damage: 10,
      },
    ],
  },
  [BattleActionId.SaucyStatus]: {
    name: 'Tomato Squeeze!',
    description: 'Applies the Saucy status',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: BattleActionType.StateChange,
        status: {
          type: StateChangeStatusType.Saucy,
          expiresIn: 3,
        },
      },
    ],
  },
  [BattleActionId.ClumsyStatus]: {
    name: 'Olive Oil',
    description: 'Slippery mess of deliciousness',
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} uses {ACTION}!',
      },
      {
        type: BattleActionType.Animation,
        animation: BattleAnimationId.Glob,
        color: '#dafd2a',
      },
      {
        type: BattleActionType.StateChange,
        status: {
          type: StateChangeStatusType.Clumsy,
          expiresIn: 3,
        },
      },
      {
        type: BattleActionType.TextMessage,
        text: '{TARGET} is slipping all around!',
      },
    ],
  },
  // Items:
  [BattleActionId.ItemRecoverStatus]: {
    name: 'Heating Lamp',
    description: 'Clear status to your character',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} uses a {ACTION}!',
      },
      {
        type: BattleActionType.StateChange,
        status: null,
      },
      {
        type: BattleActionType.TextMessage,
        text: 'Feeling fresh!',
      },
    ],
  },
  [BattleActionId.ItemRecoverHp]: {
    name: 'Parmesan',
    description: 'Recover 10 hp to your character',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} sprinkles on some {ACTION}!',
      },
      {
        type: BattleActionType.StateChange,
        recover: 10,
      },
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} recovers HP!',
      },
    ],
  },
};
