import { GameObject } from './GameObject';
import { Person } from './Person';
import { withGrid } from './utils';

export enum AnimationId {
  IdleDown = 'idle-down',
  IdleRight = 'idle-right',
  IdleUp = 'idle-up',
  IdleLeft = 'idle-left',
  WalkDown = 'walk-down',
  WalkRight = 'walk-right',
  WalkUp = 'walk-up',
  WalkLeft = 'walk-left',
  UsedDown = 'used-down',
  UnusedDown = 'unused-down',
}

type AnimationStep = [number, number];
type Animation = AnimationStep[];
type Animations = Partial<Record<AnimationId, Animation>>;

interface Config {
  animations?: Animations;
  currentAnimation?: AnimationId;
  src: string;
  gameObject: GameObject;
  animationFrameLimit?: number;
}

export class Sprite {
  animations: Animations;
  currentAnimation: AnimationId;
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
      [AnimationId.IdleDown]: [[0, 0]],
      [AnimationId.IdleRight]: [[0, 1]],
      [AnimationId.IdleUp]: [[0, 2]],
      [AnimationId.IdleLeft]: [[0, 3]],
      [AnimationId.WalkDown]: [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      [AnimationId.WalkRight]: [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      [AnimationId.WalkUp]: [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      [AnimationId.WalkLeft]: [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || AnimationId.IdleDown;
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // Configure the game object:
    this.gameObject = config.gameObject;
  }

  get frame(): AnimationStep {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(id: AnimationId) {
    if (this.currentAnimation !== id) {
      this.currentAnimation = id;
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
