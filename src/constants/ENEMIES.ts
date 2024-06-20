import { PizzaId } from './PIZZAS';

export enum EnemyId {
  Erio = 'erio',
  Beth = 'beth',
}

export enum EnemyPizzaId {
  A = 'a',
  B = 'b',
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
    src: '/images/characters/people/erio.png',
    pizzas: {
      [EnemyPizzaId.A]: {
        pizzaId: PizzaId.S001,
        maxHp: 50,
        level: 1,
      },
      [EnemyPizzaId.B]: {
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
      [EnemyPizzaId.A]: {
        hp: 1,
        pizzaId: PizzaId.F001,
        maxHp: 50,
        level: 1,
      },
    },
  },
};
