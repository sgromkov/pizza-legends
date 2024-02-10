import { GameObject } from './GameObject';
import { Person } from './Person';
import { withGrid } from './utils';

export enum AnimationKey {
  IdleDown = 'idle-down',
  IdleRight = 'idle-right',
  IdleUp = 'idle-up',
  IdleLeft = 'idle-left',
  WalkDown = 'walk-down',
  WalkRight = 'walk-right',
  WalkUp = 'walk-up',
  WalkLeft = 'walk-left',
}

type AnimationStep = [number, number];
type Animation = AnimationStep[];
type Animations = Record<AnimationKey, Animation>;

interface Config {
  animations?: Animations;
  currentAnimation?: AnimationKey;
  src: string;
  gameObject: GameObject;
  animationFrameLimit?: number;
}

export class Sprite {
  animations: Animations;
  currentAnimation: AnimationKey;
  currentAnimationFrame: number;
  image: HTMLImageElement;
  isLoaded: boolean = false;
  gameObject: GameObject;
  shadow: HTMLImageElement;
  isShadowLoaded: boolean = false;
  useShadow: boolean = true;
  animationFrameLimit: number;
  animationFrameProgress: number;

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
      [AnimationKey.IdleDown]: [[0, 0]],
      [AnimationKey.IdleRight]: [[0, 1]],
      [AnimationKey.IdleUp]: [[0, 2]],
      [AnimationKey.IdleLeft]: [[0, 3]],
      [AnimationKey.WalkDown]: [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      [AnimationKey.WalkRight]: [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      [AnimationKey.WalkUp]: [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      [AnimationKey.WalkLeft]: [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || AnimationKey.IdleDown;
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = this.animationFrameLimit;

    // Configure the game object:
    this.gameObject = config.gameObject;
  }

  get frame(): AnimationStep {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: AnimationKey) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameProgress;
    }
  }

  updateAnimationProgress() {
    // Downtick frame progress:
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the counter:
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject | Person): void {
    const x = this.gameObject.x - 8 + withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + withGrid(6) - cameraPerson.y;

    if (this.isShadowLoaded) {
      ctx.drawImage(this.shadow, x, y);
    }

    const [frameX, frameY] = this.frame;

    if (this.isLoaded) {
      ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);
    }

    this.updateAnimationProgress();
  }
}
