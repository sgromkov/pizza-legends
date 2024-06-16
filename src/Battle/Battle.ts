import {
  ActionItem,
  ActionKey,
  ActionPayload,
  StateChangeStatusType,
} from '../constants/ACTIONS';
import { PizzaKey } from '../constants/PIZZAS';
import { BattleEvent } from './BattleEvent';
import { Combatant, Team } from './Combatant';
import { TurnCycle } from './TurnCycle';

interface Config {
  onComplete: () => void;
}

export class Battle {
  element: HTMLElement;
  combatants: Record<string, Combatant>;
  activeCombatants: Record<Team, string>;
  turnCycle: TurnCycle;
  items: ActionItem[];

  constructor(config: Config) {
    this.combatants = {
      player1: new Combatant(
        {
          ...window.PIZZAS[PizzaKey.S001],
          team: Team.Player,
          hp: 40,
          maxHp: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
          isPlayerControlled: true,
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...window.PIZZAS[PizzaKey.V001],
          team: Team.Enemy,
          hp: 25,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...window.PIZZAS[PizzaKey.F001],
          team: Team.Enemy,
          hp: 50,
          maxHp: 50,
          xp: 30,
          maxXp: 100,
          level: 1,
        },
        this
      ),
    };

    this.activeCombatants = {
      [Team.Player]: 'player1',
      [Team.Enemy]: 'enemy1',
    };

    this.items = [
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p1',
        team: Team.Player,
      },
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p2',
        team: Team.Player,
      },
      {
        actionId: ActionKey.ItemRecoverHp,
        instanceId: 'p3',
        team: Team.Player,
      },
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p4',
        team: Team.Enemy,
      },
    ];
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('battle');
    this.element.innerHTML = `
      <div class="battle__hero">
        <img src="${'../../images/characters/people/hero.png'}" alt="Battle hero">
      </div>
      <div class="battle__enemy">
        <img src="${'../../images/characters/people/npc4.png'}" alt="Battle enemy">
      </div>
    `;
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event: ActionPayload) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
    });
    this.turnCycle.init();
  }
}
