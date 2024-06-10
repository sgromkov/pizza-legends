import { ActionKey } from './ACTIONS';

export enum PizzaType {
  Normal = 'normal',
  Spicy = 'spicy',
  Veggie = 'veggie',
  Fungi = 'fungi',
  Chill = 'chill',
}

export enum PizzaKey {
  S001 = 's001',
  V001 = 'v001',
  F001 = 'f001',
}

export interface Pizza {
  name: string;
  type: PizzaType;
  src: string;
  icon: string;
  actions: ActionKey[];
}

window.PIZZAS = {
  [PizzaKey.S001]: {
    name: 'Slice Samurai',
    type: PizzaType.Spicy,
    src: '/images/characters/pizzas/s001.png',
    icon: 'images/icons/spicy.png',
    actions: [ActionKey.ClumsyStatus, ActionKey.SaucyStatus, ActionKey.Damage1],
  },
  [PizzaKey.V001]: {
    name: 'Call me Kale',
    type: PizzaType.Veggie,
    src: '/images/characters/pizzas/v001.png',
    icon: 'images/icons/veggie.png',
    actions: [ActionKey.Damage1],
  },
  [PizzaKey.F001]: {
    name: 'Portobello Express',
    type: PizzaType.Fungi,
    src: '/images/characters/pizzas/f001.png',
    icon: 'images/icons/fungi.png',
    actions: [ActionKey.Damage1],
  },
};
