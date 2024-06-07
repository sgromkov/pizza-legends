import { PIZZAS, PizzaKey } from '../content/pizzas';
import { Combatant, Team } from './Combatant';

interface Config {
  onComplete: () => void;
}

export class Battle {
  element: HTMLElement;
  combatants: Record<string, Combatant>;
  activeCombatants: Record<Team, string>;

  constructor(config: Config) {
    this.combatants = {
      player1: new Combatant(
        {
          ...PIZZAS[PizzaKey.S001],
          team: Team.Player,
          hp: 50,
          maxHp: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...PIZZAS[PizzaKey.V001],
          team: Team.Enemy,
          hp: 50,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...PIZZAS[PizzaKey.F001],
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
  }
}
