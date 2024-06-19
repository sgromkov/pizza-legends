import {
  ActionKey,
  ActionPayload,
  ActionType,
  StateChangeStatusType,
  TextMessageActionPayload,
} from '../constants/ACTIONS';
import { PizzaType } from '../constants/PIZZAS';
import { randomFromArray } from '../utils';
import { Battle } from './Battle';

export enum TeamType {
  Player = 'player',
  Enemy = 'enemy',
}

export interface CombatantConfig {
  id?: string;
  // Params:
  hp?: number;
  maxHp: number;
  xp?: number;
  maxXp?: number;
  level: number;
  status?: {
    type: StateChangeStatusType;
    expiresIn: number;
  };
  isPlayerControlled?: boolean;
  // Pizza:
  name: string;
  type: PizzaType;
  src: string;
  icon: string;
  // Teams:
  team?: TeamType;
}

export class Combatant {
  battle: Battle;
  hudElement: HTMLElement;
  id: string;
  // Params:
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  level: number;
  status?: {
    type: StateChangeStatusType;
    expiresIn: number;
  };
  isPlayerControlled?: boolean;
  // Pizza:
  name: string;
  description: string;
  type: PizzaType;
  src: string;
  icon: string;
  actions: ActionKey[];
  // Teams:
  team: TeamType;
  hpFills: NodeListOf<HTMLElement>;
  xpFills: NodeListOf<HTMLElement>;
  pizzaElement: HTMLImageElement;

  constructor(config: CombatantConfig, battle: Battle) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

    this.hp = typeof this.hp === 'undefined' ? this.maxHp : this.hp;
    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;

    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return (this.xp / this.maxXp) * 100;
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.level * 20;
  }

  createElement() {
    this.hudElement = document.createElement('div');
    this.hudElement.classList.add('combatant');
    this.hudElement.setAttribute('data-combatant', this.id);
    this.hudElement.setAttribute('data-team', this.team);
    this.hudElement.innerHTML = `
      <p class="combatant__name">${this.name}</p>
      <p class="combatant__level"></p>
      <div class="combatant__character-crop">
        <img class="combatant__character" src="${this.src}" alt="${this.name}" />
      </div>
      <img class="combatant__type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 26 3" class="combatant__life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" class="combatant__xp-contariner">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
      </svg>
      <p class="combatant__status"></p>
    `;

    this.pizzaElement = document.createElement('img');
    this.pizzaElement.classList.add('pizza');
    this.pizzaElement.setAttribute('src', this.src);
    this.pizzaElement.setAttribute('alt', this.name);
    this.pizzaElement.setAttribute('data-team', this.team);

    this.hpFills = this.hudElement.querySelectorAll(
      '.combatant__life-container > rect'
    );

    this.xpFills = this.hudElement.querySelectorAll(
      '.combatant__xp-contariner > rect'
    );
  }

  update(changes: Partial<CombatantConfig> = {}) {
    // Update anything incoming:
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    // Update active flag to show the correct pizza and hud:
    this.hudElement.setAttribute('data-active', String(this.isActive));
    this.pizzaElement.setAttribute('data-active', String(this.isActive));

    // Update HP & XP percent fills:
    this.hpFills.forEach((rect) => (rect.style.width = `${this.hpPercent}%`));
    this.xpFills.forEach((rect) => (rect.style.width = `${this.xpPercent}%`));

    // Update level on screen:
    this.hudElement.querySelector('.combatant__level').innerHTML = String(
      this.level
    );

    // Update status:
    const statusElement: HTMLElement =
      this.hudElement.querySelector('.combatant__status');
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = 'block';
    } else {
      statusElement.innerText = '';
      statusElement.style.display = 'none';
    }
  }

  getReplacedEvents(originalEvents: ActionPayload[]): ActionPayload[] {
    if (
      this.status?.type === StateChangeStatusType.Clumsy &&
      randomFromArray([true, false, false])
    ) {
      return [
        { type: ActionType.TextMessage, text: `${this.name} flops over!` },
      ];
    }

    return originalEvents;
  }

  getPostEvents(): ActionPayload[] {
    if (this.status?.type === StateChangeStatusType.Saucy) {
      return [
        { type: ActionType.TextMessage, text: 'Feeling saucy!' },
        { type: ActionType.StateChange, recover: 5, onCaster: true },
      ];
    }

    return [];
  }

  decrementStatus(): TextMessageActionPayload | null {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;

      if (this.status.expiresIn === 0) {
        this.update({
          status: null,
        });

        return {
          type: ActionType.TextMessage,
          text: 'Status expired!',
        };
      }
    }

    return null;
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.pizzaElement);
    this.update();
  }
}
