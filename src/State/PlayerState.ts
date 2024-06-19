import { TeamType } from '../Battle/Combatant';
import {
  ActionItem,
  ActionKey,
  StateChangeStatusType,
} from '../constants/ACTIONS';
import { PizzaKey } from '../constants/PIZZAS';
import { EventName, emitEvent } from '../utils';

export enum PlayerPizzaKey {
  P1 = 'p1',
  P2 = 'p2',
  P3 = 'p3',
}

export interface PlayerPizza {
  pizzaId: PizzaKey;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  level: number;
  status: {
    type: StateChangeStatusType;
    expiresIn: number;
  } | null;
}

export class PlayerState {
  pizzas: Record<PlayerPizzaKey, PlayerPizza>;
  lineup: Array<Partial<PlayerPizzaKey>>;
  items: Array<ActionItem>;

  constructor() {
    this.pizzas = {
      [PlayerPizzaKey.P1]: {
        pizzaId: PizzaKey.S001,
        hp: 30,
        maxHp: 50,
        xp: 90,
        maxXp: 100,
        level: 1,
        status: {
          type: StateChangeStatusType.Saucy,
          expiresIn: 3,
        },
      },
      [PlayerPizzaKey.P2]: {
        pizzaId: PizzaKey.V001,
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
      [PlayerPizzaKey.P3]: {
        pizzaId: PizzaKey.F001,
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
    };
    this.lineup = [PlayerPizzaKey.P1, PlayerPizzaKey.P2];
    this.items = [
      {
        actionId: ActionKey.ItemRecoverHp,
        instanceId: 'item1',
      },
      {
        actionId: ActionKey.ItemRecoverHp,
        instanceId: 'item2',
      },
      {
        actionId: ActionKey.ItemRecoverHp,
        instanceId: 'item3',
      },
    ];
  }

  swapLineup(oldId: PlayerPizzaKey, incomingId: PlayerPizzaKey) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;

    emitEvent(EventName.LineupChanged);
  }

  moveToFront(futureFrontId: PlayerPizzaKey) {
    this.lineup = this.lineup.filter((id) => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);

    emitEvent(EventName.LineupChanged);
  }

  update() {}

  init() {}
}

window.playerState = new PlayerState();
