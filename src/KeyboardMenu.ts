import { SubmissionMenuOption } from './Battle/SubmissionMenu';
import { KeyPressListener } from './KeyPressListener';

export class KeyboardMenu {
  options: SubmissionMenuOption[];
  up: KeyPressListener;
  down: KeyPressListener;
  prevFocus: HTMLButtonElement;
  element: HTMLElement;
  descriptionElement: HTMLElement;
  descriptionElementText: HTMLElement;

  constructor() {
    this.options = [];
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options: SubmissionMenuOption[]) {
    this.options = options;
    this.element.innerHTML = this.options
      .map((option, index) => {
        const disabledAttr = option.disabled ? 'disabled' : '';

        return `
        <div class="option">
          <button
            ${disabledAttr}
            data-button="${index}"
            data-description="${option.description}"
          >
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ''}</span>
        </div>
      `;
      })
      .join('');

    this.element.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const chosenOption = this.options[Number(button.dataset.button)];
        chosenOption.handler();
      });
      button.addEventListener('mouseenter', () => {
        button.focus();
      });
      button.addEventListener('focus', () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    setTimeout(() => {
      const autoFocusedButton: HTMLButtonElement = this.element.querySelector(
        'button[data-button]:not([disabled])'
      );

      autoFocusedButton.focus();
    }, 10);
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('keyboard-menu');

    // Description box element:
    this.descriptionElement = document.createElement('div');
    this.descriptionElement.classList.add('description-box');
    this.descriptionElement.innerHTML = `<p>I will</p>`;
    this.descriptionElementText = this.descriptionElement.querySelector('p');
  }

  end() {
    // Remove menu element and description element:
    this.element.remove();
    this.descriptionElement.remove();

    // Clean up bindings:
    this.up.unbind();
    this.down.unbind();
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeyPressListener('ArrowUp', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const prevButton = (
        Array.from(
          this.element.querySelectorAll('button[data-button]')
        ) as HTMLButtonElement[]
      )
        .reverse()
        .find((el) => {
          return Number(el.dataset.button) < current && !el.disabled;
        });

      prevButton?.focus();
    });

    this.down = new KeyPressListener('ArrowDown', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const nextButton = (
        Array.from(
          this.element.querySelectorAll('button[data-button]')
        ) as HTMLButtonElement[]
      ).find((el) => {
        return Number(el.dataset.button) > current && !el.disabled;
      });

      nextButton?.focus();
    });
  }
}
