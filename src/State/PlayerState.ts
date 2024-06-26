import { TeamType } from '../Battle/Combatant';
import {
  BattleActionItem,
  BattleActionId,
  StateChangeStatusType,
} from '../constants/BATLE_ACTIONS';
import { PizzaId } from '../constants/PIZZAS';
import { EventName, emitEvent } from '../utils';

export type PlayerPizzaId = string;

export enum StoryFlag {
  DidSomething = 'DID_SOMETHING',
  DefeatedFirstBoss = 'DEFEATED_FIRST_BOSS',
  TalkToErio = 'TALK_TO_ERIO',
  DefeatedBeth = 'DEFEATED_BETH',
  UsedPizzaStone = 'USED_PIZZA_STONE',
  StreetBattle = 'STREET_BATTLE',
  StreetNorthBattle = 'STREET_NORTH_BATTLE',
  DiningRoomBattle = 'DINING_ROOM_BATTLE',
  StoneShop = 'STONE_SHOP',
  StoneStreetNorth = 'STONE_STREET_NORTH',
  ChefRootie = 'CHEF_ROOTIE',
  SeenIntro = 'SEEN_INTRO'
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
  lineup: PlayerPizzaId[];
  items: Array<BattleActionItem>;
  storyFlags: Partial<Record<StoryFlag, boolean>>;

  constructor() {
    this.pizzas = {
      p1: {
        pizzaId: PizzaId.S001,
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null,
        // status: {
        //   type: StateChangeStatusType.Saucy,
        //   expiresIn: 3,
        // },
      },
    };
    this.lineup = ['p1'];
    this.items = [
      {
        actionId: BattleActionId.ItemRecoverHp,
        instanceId: 'item1',
      },
      {
        actionId: BattleActionId.ItemRecoverHp,
        instanceId: 'item2',
      },
      {
        actionId: BattleActionId.ItemRecoverHp,
        instanceId: 'item3',
      },
    ];
    this.storyFlags = {};
  }

  addPizza(id: PizzaId) {
    const newId: PlayerPizzaId =
      `p${Date.now()}` + Math.floor(Math.random() * 99999);

    this.pizzas[newId] = {
      pizzaId: id,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };

    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }

    emitEvent(EventName.LineupChanged);
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
