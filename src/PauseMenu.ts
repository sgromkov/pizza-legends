import { KeyPressListener } from './KeyPressListener';
import { KeyboardMenu, KeyboardMenuOption } from './KeyboardMenu';
import { Progress } from './Progress';
import { PlayerPizzaId } from './State/PlayerState';
import { wait } from './utils';

export enum PauseMenuPageKey {
  Root = 'root',
}

export class PauseMenu {
  progress: Progress;
  onComplete: Function;
  element: HTMLElement;
  keyboardMenu: KeyboardMenu;
  esc: KeyPressListener;

  constructor({
    progress,
    onComplete,
  }: {
    progress: Progress;
    onComplete: Function;
  }) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions(pageKey: PauseMenuPageKey | PlayerPizzaId): KeyboardMenuOption[] {
    // Case 1: Show the first page of options:
    if (pageKey === PauseMenuPageKey.Root) {
      const lineupPizzas: KeyboardMenuOption[] = window.playerState.lineup.map(
        (id) => {
          const { pizzaId } = window.playerState.pizzas[id];
          const base = window.PIZZAS[pizzaId];
          const option: KeyboardMenuOption = {
            label: base.name,
            description: base.description,
            handler: () => {
              this.keyboardMenu.setOptions(this.getOptions(id));
            },
          };

          return option;
        }
      );
      return [
        ...lineupPizzas,
        {
          label: 'Созранить',
          description: 'Сохранить свой прогресс в игре',
          handler: () => {
            this.progress.save();
            this.close();
          },
        },
        {
          label: 'Закрыть',
          description: 'Закрыть меню',
          handler: () => {
            this.close();
          },
        },
      ];
    }

    // Case 2: Show the options for just one pizza (by id):
    const unequipped: KeyboardMenuOption[] = Object.keys(
      window.playerState.pizzas
    )
      .filter((id: PlayerPizzaId) => {
        return window.playerState.lineup.indexOf(id) === -1;
      })
      .map((id: PlayerPizzaId) => {
        const { pizzaId } = window.playerState.pizzas[id];
        const base = window.PIZZAS[pizzaId];
        const option: KeyboardMenuOption = {
          label: `Заменить на ${base.name}`,
          description: base.description,
          handler: () => {
            window.playerState.swapLineup(pageKey, id);
            this.keyboardMenu.setOptions(
              this.getOptions(PauseMenuPageKey.Root)
            );
          },
        };

        return option;
      });

    return [
      ...unequipped,
      {
        label: 'Переместить наверх',
        description: 'Переместить пиццу на самый верх',
        handler: () => {
          window.playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getOptions(PauseMenuPageKey.Root));
        },
      },
      {
        label: 'Назад',
        description: 'Вернуться в предыдущее меню',
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions(PauseMenuPageKey.Root));
        },
      },
    ];
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('pause-menu');
    this.element.classList.add('overlay-menu');
    this.element.innerHTML = `
      <h2>Пауза</h2>
    `;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container: HTMLElement) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions(PauseMenuPageKey.Root));

    container.appendChild(this.element);

    wait(200);
    this.esc = new KeyPressListener('Escape', () => {
      this.close();
    });
  }
}
