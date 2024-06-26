import { PizzaId } from './PIZZAS';

export enum EnemyId {
  Erio = 'erio',
  Beth = 'beth',
  ChefRootie = 'chefRootie',
  StreetBattle = 'streetBattle',
  StreetNorthBattle = 'streetNorthBattle',
  DiningRoomBattle = 'diningRoomBattle',
}

export enum EnemyPizzaId {
  ErioPizza1 = 'ErioPizza1',
  ErioPizza2 = 'ErioPizza2',
  BethPizza1 = 'BethPizza1',
  ChefRootiePizza1 = 'ChefRootiePizza1',
  StreetNorthBattlePizza1 = 'StreetNorthBattlePizza1',
  DiningRoomBattlePizza1 = 'DiningRoomBattlePizza1',
  DiningRoomBattlePizza2 = 'DiningRoomBattlePizza2',
  StreetBattlePizza1 = 'StreetBattlePizza1',
}

export interface EnemyPizza {
  pizzaId: PizzaId;
  hp?: number;
  maxHp: number;
  level: number;
}

export interface Enemy {
  name: string;
  src: string;
  pizzas: Partial<Record<EnemyPizzaId, EnemyPizza>>;
}

window.ENEMIES = {
  [EnemyId.Erio]: {
    name: 'Erio',
    src: '/images/characters/people/npc6.png',
    pizzas: {
      [EnemyPizzaId.ErioPizza1]: {
        pizzaId: PizzaId.S001,
        maxHp: 50,
        level: 1,
      },
      [EnemyPizzaId.ErioPizza2]: {
        pizzaId: PizzaId.S002,
        maxHp: 50,
        level: 1,
      },
    },
  },
  [EnemyId.Beth]: {
    name: 'Beth',
    src: '/images/characters/people/npc1.png',
    pizzas: {
      [EnemyPizzaId.BethPizza1]: {
        hp: 1,
        pizzaId: PizzaId.F001,
        maxHp: 50,
        level: 1,
      },
    },
  },
  [EnemyId.ChefRootie]: {
    name: 'Rootie',
    src: '/images/characters/people/second-boss.png',
    pizzas: {
      [EnemyPizzaId.ChefRootiePizza1]: {
        pizzaId: PizzaId.F002,
        maxHp: 30,
        level: 2,
      },
    },
  },
  [EnemyId.StreetNorthBattle]: {
    name: 'Pizza Thug',
    src: '/images/characters/people/npc8.png',
    pizzas: {
      [EnemyPizzaId.StreetNorthBattlePizza1]: {
        pizzaId: PizzaId.S001,
        maxHp: 20,
        level: 1,
      },
    },
  },
  [EnemyId.DiningRoomBattle]: {
    name: 'Pizza Thug',
    src: '/images/characters/people/npc8.png',
    pizzas: {
      [EnemyPizzaId.DiningRoomBattlePizza1]: {
        pizzaId: PizzaId.S001,
        maxHp: 15,
        level: 1,
      },
      [EnemyPizzaId.DiningRoomBattlePizza2]: {
        pizzaId: PizzaId.S002,
        maxHp: 15,
        level: 1,
      },
    },
  },
  [EnemyId.StreetBattle]: {
    name: 'Pizza Thug',
    src: '/images/characters/people/npc8.png',
    pizzas: {
      [EnemyPizzaId.StreetBattlePizza1]: {
        pizzaId: PizzaId.F002,
        maxHp: 25,
        level: 1,
      },
    },
  },
};
