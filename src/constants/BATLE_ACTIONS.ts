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
    name: 'Бросок теста',
    description: 'Мягкий пунш из теста',
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} использует {ACTION}!',
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
    name: 'Томатная паста',
    description: 'Поливает томатной пастой',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} использует {ACTION}!',
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
    name: 'Оливковое масло',
    description: 'Вкусно, но скользко!',
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} использует {ACTION}!',
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
        text: '{TARGET} всюду подскальзывается!',
      },
    ],
  },
  // Items:
  [BattleActionId.ItemRecoverStatus]: {
    name: 'Подогрев пиццы',
    description: 'Очистит негативные эффекты на вашем персонажу',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} использует {ACTION}!',
      },
      {
        type: BattleActionType.StateChange,
        status: null,
      },
      {
        type: BattleActionType.TextMessage,
        text: 'Чувствую свежесть!',
      },
    ],
  },
  [BattleActionId.ItemRecoverHp]: {
    name: 'Пармезан',
    description: 'Восстановит 10 пунктов здоровья вашему персонажу',
    targetType: BattleActionTargetType.Friendly,
    success: [
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} берет {ACTION} и посыпает им пиццу!',
      },
      {
        type: BattleActionType.StateChange,
        recover: 10,
      },
      {
        type: BattleActionType.TextMessage,
        text: '{CASTER} Восстановал здрровье!',
      },
    ],
  },
};
