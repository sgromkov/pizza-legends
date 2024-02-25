import { KeyPressListener } from './KeyPressListener';

export class TextMessage {
  text: string;
  onComplete: Function;
  element: HTMLElement;
  actionListener: KeyPressListener;

  constructor({ text, onComplete }: { text: string; onComplete: Function }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('text-message');
    this.element.innerHTML = `
      <p class="text-message__text">${this.text}</p>
      <button class="text-message__button">Next</button>
    `;

    const button = this.element.querySelector('button');
    const clickEventListener = () => {
      button.removeEventListener('click', clickEventListener);
      this.done();
    };
    button.addEventListener('click', clickEventListener);

    this.actionListener = new KeyPressListener('Enter', () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done(): void {
    this.element.remove();
    this.onComplete();
  }

  init(container: HTMLElement): void {
    this.createElement();
    container.appendChild(this.element);
  }
}
