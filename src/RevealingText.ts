interface Config {
  element: HTMLElement;
  text: string;
  speed?: number;
}

interface Character {
  span: HTMLElement;
  delayAfter: number;
}

export class RevealingText {
  element: HTMLElement;
  text: string;
  speed: number;
  timeout: NodeJS.Timeout;
  isDone: boolean;

  constructor(config: Config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(characters: Character[]) {
    const next = characters.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (characters.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(characters);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll('span').forEach((span) => {
      span.classList.add('revealed');
    });
  }

  init() {
    let characters: Character[] = [];
    this.text.split('').forEach((chararcter) => {
      // Create each span, add to element in DOM:
      const span = document.createElement('span');
      span.textContent = chararcter;
      this.element.appendChild(span);

      // Add this span to our internal state Array:
      characters.push({
        span,
        delayAfter: chararcter === ' ' ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}
