import { PizzaKey } from './PIZZAS';

export enum EnemyKey {
  Erio = 'erio',
  Beth = 'beth',
}

export enum EnemyPizzaKey {
  A = 'a',
  B = 'b',
}

export interface EnemyPizza {
  pizzaId: PizzaKey;
  hp?: number;
  maxHp: number;
  level: number;
}

export interface Enemy {
  name: string;
  src: string;
  pizzas: Partial<Record<EnemyPizzaKey, EnemyPizza>>;
}

window.ENEMIES = {
  [EnemyKey.Erio]: {
    name: 'Erio',
    src: '/images/characters/people/erio.png',
    pizzas: {
      [EnemyPizzaKey.A]: {
        pizzaId: PizzaKey.S001,
        maxHp: 50,
        level: 1,
      },
      [EnemyPizzaKey.B]: {
        pizzaId: PizzaKey.S002,
        maxHp: 50,
        level: 1,
      },
    },
  },
  [EnemyKey.Beth]: {
    name: 'Beth',
    src: '/images/characters/people/npc1.png',
    pizzas: {
      [EnemyPizzaKey.A]: {
        hp: 1,
        pizzaId: PizzaKey.F001,
        maxHp: 50,
        level: 1,
      },
    },
  },
};
