import { TeamType } from '../Battle/Combatant';
import {
  ActionItem,
  ActionId,
  StateChangeStatusType,
} from '../constants/ACTIONS';
import { PizzaId } from '../constants/PIZZAS';
import { EventName, emitEvent } from '../utils';

export enum PlayerPizzaId {
  P1 = 'p1',
  P2 = 'p2',
  P3 = 'p3',
}

export interface PlayerPizza {
  pizzaId: PizzaId;
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
  pizzas: Record<PlayerPizzaId, PlayerPizza>;
  lineup: Array<Partial<PlayerPizzaId>>;
  items: Array<ActionItem>;

  constructor() {
    this.pizzas = {
      [PlayerPizzaId.P1]: {
        pizzaId: PizzaId.S001,
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
      [PlayerPizzaId.P2]: {
        pizzaId: PizzaId.V001,
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
      [PlayerPizzaId.P3]: {
        pizzaId: PizzaId.F001,
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
    };
    this.lineup = [PlayerPizzaId.P1, PlayerPizzaId.P2];
    this.items = [
      {
        actionId: ActionId.ItemRecoverHp,
        instanceId: 'item1',
      },
      {
        actionId: ActionId.ItemRecoverHp,
        instanceId: 'item2',
      },
      {
        actionId: ActionId.ItemRecoverHp,
        instanceId: 'item3',
      },
    ];
  }

  swapLineup(oldId: PlayerPizzaId, incomingId: PlayerPizzaId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;

    emitEvent(EventName.LineupChanged);
  }

  moveToFront(futureFrontId: PlayerPizzaId) {
    this.lineup = this.lineup.filter((id) => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);

    emitEvent(EventName.LineupChanged);
  }

  update() {}

  init() {}
}

window.playerState = new PlayerState();
