import { BattleActionId } from './BATLE_ACTIONS';

export enum PizzaType {
  Normal = 'normal',
  Spicy = 'spicy',
  Veggie = 'veggie',
  Fungi = 'fungi',
  Chill = 'chill',
}

export enum PizzaId {
  S001 = 's001',
  S002 = 's002',
  V001 = 'v001',
  F001 = 'f001'
}

export interface Pizza {
  name: string;
  description: string;
  type: PizzaType;
  src: string;
  icon: string;
  actions: BattleActionId[];
}

window.PIZZAS = {
  [PizzaId.S001]: {
    name: 'Slice Samurai',
    description: 'Pizza desc here',
    type: PizzaType.Spicy,
    src: '/images/characters/pizzas/s001.png',
    icon: 'images/icons/spicy.png',
    actions: [BattleActionId.ClumsyStatus, BattleActionId.SaucyStatus, BattleActionId.Damage1],
  },
  [PizzaId.S002]: {
    name: 'Bacon Brigade',
    description: 'A salty warrior who fears nothing',
    type: PizzaType.Spicy,
    src: '/images/characters/pizzas/s002.png',
    icon: 'images/icons/spicy.png',
    actions: [BattleActionId.Damage1, BattleActionId.SaucyStatus, BattleActionId.ClumsyStatus],
  },
  [PizzaId.V001]: {
    name: 'Call me Kale',
    description: 'Pizza desc here',
    type: PizzaType.Veggie,
    src: '/images/characters/pizzas/v001.png',
    icon: 'images/icons/veggie.png',
    actions: [BattleActionId.Damage1],
  },
  [PizzaId.F001]: {
    name: 'Portobello Express',
    description: 'Pizza desc here',
    type: PizzaType.Fungi,
    src: '/images/characters/pizzas/f001.png',
    icon: 'images/icons/fungi.png',
    actions: [BattleActionId.Damage1],
  },
};
