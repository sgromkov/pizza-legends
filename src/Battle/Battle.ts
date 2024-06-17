import {
  ActionItem,
  ActionKey,
  ActionPayload,
  StateChangeStatusType,
} from '../constants/ACTIONS';
import { PizzaKey } from '../constants/PIZZAS';
import { BattleEvent } from './BattleEvent';
import { Combatant, TeamType } from './Combatant';
import { Team } from './Team';
import { TurnCycle } from './TurnCycle';

interface Config {
  onComplete: () => void;
}

export class Battle {
  element: HTMLElement;
  combatants: Record<string, Combatant>;
  activeCombatants: Record<TeamType, string>;
  turnCycle: TurnCycle;
  items: ActionItem[];
  playerTeam: Team;
  enemyTeam: Team;

  constructor(config: Config) {
    this.combatants = {
      player1: new Combatant(
        {
          ...window.PIZZAS[PizzaKey.S001],
          team: TeamType.Player,
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
      player2: new Combatant(
        {
          ...window.PIZZAS[PizzaKey.S002],
          team: TeamType.Player,
          hp: 30,
          maxHp: 50,
          xp: 75,
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
          team: TeamType.Enemy,
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
          team: TeamType.Enemy,
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
      [TeamType.Player]: 'player1',
      [TeamType.Enemy]: 'enemy1',
    };

    this.items = [
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p1',
        team: TeamType.Player,
      },
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p2',
        team: TeamType.Player,
      },
      {
        actionId: ActionKey.ItemRecoverHp,
        instanceId: 'p3',
        team: TeamType.Player,
      },
      {
        actionId: ActionKey.ItemRecoverStatus,
        instanceId: 'p4',
        team: TeamType.Enemy,
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

    this.playerTeam = new Team(TeamType.Player, 'Hero');
    this.enemyTeam = new Team(TeamType.Enemy, 'Bully');

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      // Add to correct team:
      if (combatant.team === TeamType.Player) {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === TeamType.Enemy) {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

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
