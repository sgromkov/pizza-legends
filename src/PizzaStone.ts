import { ActionState, GameObject, GameObjectConfig } from './GameObject';
import { OverworldEventAction } from './OverworldEvent';
import { AnimationId, Sprite } from './Sprite';
import { PizzaId } from './constants/PIZZAS';

export interface PizzaStoneConfig extends GameObjectConfig {
  pizzas: PizzaId[];
}

export class PizzaStone extends GameObject {
  pizzas: PizzaId[];

  constructor(config: PizzaStoneConfig) {
    super(config);

    this.sprite = new Sprite({
      gameObject: this,
      src: '/images/characters/pizza-stone.png',
      animations: {
        [AnimationId.UsedDown]: [[0, 0]],
        [AnimationId.UnusedDown]: [[1, 0]],
      },
      currentAnimation: AnimationId.UsedDown,
    });

    this.storyFlag = config.storyFlag;

    this.pizzas = config.pizzas;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          {
            type: OverworldEventAction.TextMessage,
            text: 'Вы уже взяли пиццу отсюда.',
          },
        ],
      },
      {
        events: [
          {
            type: OverworldEventAction.TextMessage,
            text: 'А вот и легендарный стол для приготовления пиццы...',
          },
          {
            type: OverworldEventAction.CraftingMenu,
            pizzas: this.pizzas,
          },
          {
            type: OverworldEventAction.AddStoryFlag,
            flag: this.storyFlag,
          },
        ],
      },
    ];
  }

  update(): void {
    this.sprite.currentAnimation = window.playerState.storyFlags[this.storyFlag]
      ? AnimationId.UsedDown
      : AnimationId.UnusedDown;
  }
}
