import { KeyPressListener } from './KeyPressListener';
import { RevealingText } from './RevealingText';

export class TextMessage {
  text: string;
  onComplete: Function;
  element: HTMLElement;
  actionListener: KeyPressListener;
  revealingText: RevealingText;

  constructor({ text, onComplete }: { text: string; onComplete: Function }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement(): void {
    // Create the element:
    this.element = document.createElement('div');
    this.element.classList.add('text-message');
    this.element.innerHTML = `
      <p class="text-message__text"></p>
      <button class="text-message__button">Далее</button>
    `;

    // Init the typewriter effect:
    this.revealingText = new RevealingText({
      text: this.text,
      element: this.element.querySelector('.text-message__text'),
    });

    const button = this.element.querySelector('button');
    const clickEventListener = () => {
      button.removeEventListener('click', clickEventListener);
      // Close the text message:
      this.done();
    };
    button.addEventListener('click', clickEventListener);

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done();
    });
  }

  done(): void {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container: HTMLElement): void {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
