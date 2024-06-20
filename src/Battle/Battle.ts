import { PlayerPizzaId } from '../State/PlayerState';
import {
  ActionItem,
  ActionId,
  ActionPayload,
  StateChangeStatusType,
} from '../constants/ACTIONS';
import { Enemy, EnemyPizzaId } from '../constants/ENEMIES';
import { PizzaId } from '../constants/PIZZAS';
import { EventName, emitEvent } from '../utils';
import { BattleEvent } from './BattleEvent';
import { Combatant, CombatantConfig, TeamType } from './Combatant';
import { Team } from './Team';
import { TurnCycle } from './TurnCycle';

interface Config {
  enemy: Enemy;
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
  enemy: Enemy;
  usedInstanceIds: Record<string, boolean>;
  onComplete: () => void;

  constructor({ enemy, onComplete }: Config) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {};

    this.activeCombatants = {
      [TeamType.Player]: null, // 'player1',
      [TeamType.Enemy]: null, // 'enemy1',
    };

    // Dynamically add the Player team:
    window.playerState.lineup.forEach((id: PlayerPizzaId) => {
      this.addCombatant(id, TeamType.Player, window.playerState.pizzas[id]);
    });

    // Dynamically add the Enemy team:
    Object.keys(this.enemy.pizzas).forEach((id: EnemyPizzaId) => {
      this.addCombatant('e_' + id, TeamType.Enemy, this.enemy.pizzas[id]);
    });

    // Start empty:
    this.items = [];

    // Add in player items:
    window.playerState.items.forEach((item) => {
      this.items.push({
        ...item,
        team: TeamType.Player,
      });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(
    id: string,
    team: TeamType,
    config: {
      pizzaId: PizzaId;
      hp?: number;
      maxHp: number;
      xp?: number;
      maxXp?: number;
      level: number;
      status?: {
        type: StateChangeStatusType;
        expiresIn: number;
      };
    }
  ) {
    this.combatants[id] = new Combatant(
      {
        ...window.PIZZAS[config.pizzaId],
        ...config,
        team,
        isPlayerControlled: team === TeamType.Player,
      },
      this
    );

    // Populate first active pizza:
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('battle');
    this.element.innerHTML = `
      <div class="battle__hero">
        <img src="${'../../images/characters/people/hero.png'}" alt="Battle hero">
      </div>
      <div class="battle__enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}">
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
      onWinner: (winnerTeam: TeamType) => {
        if (winnerTeam === TeamType.Player) {
          Object.keys(window.playerState.pizzas).forEach(
            (id: PlayerPizzaId) => {
              const playerStatePizza = window.playerState.pizzas[id];
              const combatant = this.combatants[id];

              if (combatant) {
                playerStatePizza.hp = combatant.hp;
                playerStatePizza.xp = combatant.xp;
                playerStatePizza.maxXp = combatant.maxXp;
                playerStatePizza.level = combatant.level;
              }
            }
          );

          // Get rid of player used items:
          window.playerState.items = window.playerState.items.filter((item) => {
            return !this.usedInstanceIds[item.instanceId];
          });

          // Send signal to update:
          emitEvent(EventName.PlayerStateUpdated);
        }

        this.element.remove();
        this.onComplete();
      },
    });
    this.turnCycle.init();
  }
}
