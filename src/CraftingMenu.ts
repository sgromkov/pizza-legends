import { KeyboardMenu, KeyboardMenuOption } from './KeyboardMenu';
import { PizzaId } from './constants/PIZZAS';

interface CraftingMenuConfig {
  pizzas: PizzaId[];
  onComplete: Function;
}

export class CraftingMenu {
  pizzas: PizzaId[];
  onComplete: Function;
  element: HTMLElement;
  keyboardMenu: KeyboardMenu;

  constructor(config: CraftingMenuConfig) {
    this.pizzas = config.pizzas;
    this.onComplete = config.onComplete;
  }

  getOptions(): KeyboardMenuOption[] {
    const options: KeyboardMenuOption[] = this.pizzas.map((id) => {
      const base = window.PIZZAS[id];
      const option: KeyboardMenuOption = {
        label: base.name,
        description: base.description,
        handler: () => {
          window.playerState.addPizza(id);
          this.close();
        },
      };

      return option;
    });

    return options;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('crafting-menu');
    this.element.classList.add('overlay-menu');
    this.element.innerHTML = `
      <h2>Создай пиццу</h2>
    `;
  }

  close() {
    this.keyboardMenu?.end();
    this.element.remove();
    this.onComplete();
  }

  init(container: HTMLElement) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions());
    container.appendChild(this.element);
  }
}
