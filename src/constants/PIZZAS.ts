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
  V002 = 'v002',
  F001 = 'f001',
  F002 = 'f002',
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
    name: 'Мечта самурая',
    description: 'Мясная пицца, о которой мечтает каждый самурай в жаркий летний день в Японии',
    type: PizzaType.Spicy,
    src: '/images/characters/pizzas/s001.png',
    icon: 'images/icons/spicy.png',
    actions: [
      BattleActionId.ClumsyStatus,
      BattleActionId.SaucyStatus,
      BattleActionId.Damage1,
    ],
  },
  [PizzaId.S002]: {
    name: 'Диабло',
    description: 'Пицца, которая обязательно понравится истинным ценителям итальянской кухни',
    type: PizzaType.Spicy,
    src: '/images/characters/pizzas/s002.png',
    icon: 'images/icons/spicy.png',
    actions: [
      BattleActionId.Damage1,
      BattleActionId.SaucyStatus,
      BattleActionId.ClumsyStatus,
    ],
  },
  [PizzaId.V001]: {
    name: 'Овощное безумие',
    description: 'Овощная пицца придаст вам сил и улучшит ваше настроение',
    type: PizzaType.Veggie,
    src: '/images/characters/pizzas/v001.png',
    icon: 'images/icons/veggie.png',
    actions: [BattleActionId.Damage1],
  },
  [PizzaId.V002]: {
    name: 'Сицилия',
    description: 'Для любителей овощной пиццы и большого количества начинки',
    type: PizzaType.Veggie,
    src: '/images/characters/pizzas/v002.png',
    icon: '/images/icons/veggie.png',
    actions: [BattleActionId.Damage1],
  },
  [PizzaId.F001]: {
    name: 'Монтанара',
    description: 'Обожаемая детишками и их родителями - пицца Монтанара',
    type: PizzaType.Fungi,
    src: '/images/characters/pizzas/f001.png',
    icon: 'images/icons/fungi.png',
    actions: [BattleActionId.Damage1],
  },
  [PizzaId.F002]: {
    name: ' Бекон и грибы',
    description: 'Насыщенный и сочный вкус бекона придаёт пицце не только нежность, но и лёгкое послевкусие',
    type: PizzaType.Fungi,
    src: '/images/characters/pizzas/f002.png',
    icon: '/images/icons/fungi.png',
    actions: [BattleActionId.Damage1],
  },
};
