import { GameObject } from './GameObject';

interface Config {
  element: HTMLElement;
}

export class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(config: Config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = '../images/maps/demo-lower.png';

    const hero = new GameObject({
      src: '../images/characters/people/hero.png',
      x: 7,
      y: 5,
    });

    const npc1 = new GameObject({
      src: '../images/characters/people/npc1.png',
      x: 4,
      y: 9,
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc1.sprite.draw(this.ctx);
    }, 200);
  }
}
