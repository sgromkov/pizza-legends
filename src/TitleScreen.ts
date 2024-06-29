import { KeyboardMenu, KeyboardMenuOption } from './KeyboardMenu';
import { Progress, ProgressPayload } from './Progress';

interface TitleScreenConfig {
  progress: Progress;
}

export class TitleScreen {
  element: HTMLElement;
  keyboardMenu: KeyboardMenu;
  progress: Progress;

  constructor(config: TitleScreenConfig) {
    this.progress = config.progress;
  }

  getOptions(
    resolve: (value: ProgressPayload | PromiseLike<ProgressPayload>) => void
  ): KeyboardMenuOption[] {
    const saveFile = this.progress.getSaveFile();
    const options: KeyboardMenuOption[] = [
      {
        label: 'Новая игра',
        description: 'Начните новое приключение и станьте лучшим пиццайоло!',
        handler: () => {
          this.close();
          resolve(null);
        },
      },
      saveFile
        ? {
            label: 'Продолжить игру',
            description: 'Возобновите прежнее приключение.',
            handler: () => {
              this.close();
              resolve(saveFile);
            },
          }
        : null,
    ].filter((el) => el);

    return options;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('title-screen');
    this.element.innerHTML = `
      <img class="title-screen__logo" src="/images/logo.png" alt="Pizza Legends logo" />
    `;
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container: HTMLElement): Promise<ProgressPayload | null> {
    return new Promise((resolve) => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
