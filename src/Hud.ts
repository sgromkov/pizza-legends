import { Combatant } from './Battle/Combatant';
import { EventName } from './utils';

export class Hud {
  element: HTMLElement;
  scoreboards: Combatant[];

  constructor() {
    this.scoreboards = [];
  }

  update() {
    this.scoreboards.forEach((scoreboard) => {
      scoreboard.update(window.playerState.pizzas[scoreboard.id]);
    });
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('hud');

    window.playerState.lineup.forEach((id) => {
      const pizza = window.playerState.pizzas[id];
      const scoreBoard = new Combatant(
        {
          id,
          ...window.PIZZAS[pizza.pizzaId],
          ...pizza,
        },
        null
      );
      scoreBoard.createElement();
      this.scoreboards.push(scoreBoard);
      this.element.appendChild(scoreBoard.hudElement);
    });

    this.update();
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener(EventName.PlayerStateUpdated, () => {
      this.update();
    });
  }
}
