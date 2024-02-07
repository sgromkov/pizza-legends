import { GameObject } from './GameObject';

type AnimationStep = [number, number];
type Animation = AnimationStep[];
type Animations = Record<string, Animation>;

interface Config {
  animations?: Animations;
  currentAnimation?: string;
  src: string;
  gameObject: GameObject;
}

export class Sprite {
  animations: Animations;
  currentAnimation: string;
  currentAnimationFrame: number;
  image: HTMLImageElement;
  isLoaded: boolean = false;
  gameObject: GameObject;
  shadow: HTMLImageElement;
  isShadowLoaded: boolean = false;
  useShadow: boolean = true;

  constructor(config: Config) {
    // Set up the image:
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow:
    this.shadow = new Image();
    if (this.useShadow) {
      this.shadow.src = '../images/characters/shadow.png';
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // Configure Animation & Initial State:
    this.animations = config.animations || {
      idleDown: [[0, 0]],
    };
    this.currentAnimation = config.currentAnimation || 'idleDown';
    this.currentAnimationFrame = 0;

    // Configure the game object:
    this.gameObject = config.gameObject;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    if (this.isShadowLoaded) {
      ctx.drawImage(this.shadow, x, y);
    }

    if (this.isLoaded) {
      ctx.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32);
    }
  }
}
