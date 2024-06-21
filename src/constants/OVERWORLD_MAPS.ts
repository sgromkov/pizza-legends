import { Direction, GameObject, GameObjectId } from '../GameObject';
import { OverworldEventAction } from '../OverworldEvent';
import { MapId, OverworldMapConfig } from '../OverworldMap';
import { Person } from '../Person';
import { asGridCoord, withGrid } from '../utils';
import { StoryFlag } from '../State/PlayerState';
import { EnemyId } from './ENEMIES';
import { PizzaStone } from '../PizzaStone';
import { PizzaId } from './PIZZAS';

window.OVERWORLD_MAPS = {
  [MapId.DemoRoom]: {
    lowerSrc: '../images/maps/demo-lower.png',
    upperSrc: '../images/maps/demo-upper.png',
    gameObjects: {
      [GameObjectId.Hero]: new Person({
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
      }),
      [GameObjectId.Beth]: new Person({
        src: '../images/characters/people/npc1.png',
        x: withGrid(7),
        y: withGrid(9),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 800,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 800,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 1200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 300,
          },
        ],
        talking: [
          {
            required: [StoryFlag.TalkToErio],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "Isn't Erio the coolest?",
                faceHero: GameObjectId.Beth,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "I'm going to crush you!",
                faceHero: GameObjectId.Beth,
              },
              { type: OverworldEventAction.Battle, enemyId: EnemyId.Beth },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.DefeatedBeth,
              },
              {
                type: OverworldEventAction.TextMessage,
                text: 'You crushed me.',
                faceHero: GameObjectId.Beth,
              },
              // { type: OverworldEventAction.TextMessage, text: 'Go away!' },
              // {
              //   type: OverworldEventAction.Walk,
              //   direction: Direction.Left,
              //   who: GameObjectName.Hero,
              // },
              // {
              //   type: OverworldEventAction.Walk,
              //   direction: Direction.Up,
              //   who: GameObjectName.Hero,
              // },
            ],
          },
        ],
      }),
      [GameObjectId.Erio]: new Person({
        src: '../images/characters/people/erio.png',
        x: withGrid(8),
        y: withGrid(5),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Hello!',
                faceHero: GameObjectId.Erio,
              },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.TalkToErio,
              },
              // { type: OverworldEventAction.Battle, enemyId: EnemyId.Erio },
              // {
              //   type: OverworldEventAction.Walk,
              //   direction: Direction.Left,
              //   who: GameObjectName.Hero,
              // },
              // {
              //   type: OverworldEventAction.Walk,
              //   direction: Direction.Up,
              //   who: GameObjectName.Hero,
              // },
            ],
          },
        ],
        // behaviourLoop: [
        //   {
        //     type: OverworldEventAction.Walk,
        //     direction: Direction.Left,
        //   },
        //   {
        //     type: OverworldEventAction.Stand,
        //     direction: Direction.Up,
        //     time: 800,
        //   },
        //   {
        //     type: OverworldEventAction.Walk,
        //     direction: Direction.Up,
        //   },
        //   {
        //     type: OverworldEventAction.Walk,
        //     direction: Direction.Right,
        //   },
        //   {
        //     type: OverworldEventAction.Walk,
        //     direction: Direction.Down,
        //   },
        // ],
      }),
      [GameObjectId.PizzaStone]: new PizzaStone({
        x: withGrid(2),
        y: withGrid(7),
        storyFlag: StoryFlag.UsedPizzaStone,
        pizzas: [PizzaId.V001, PizzaId.F001],
      }),
    },
    walls: {
      [asGridCoord(7, 6)]: true,
      [asGridCoord(8, 6)]: true,
      [asGridCoord(7, 7)]: true,
      [asGridCoord(8, 7)]: true,
      [asGridCoord(6, 4)]: true,
      [asGridCoord(8, 4)]: true,
      [asGridCoord(3, 4)]: true,
      [asGridCoord(4, 4)]: true,
      [asGridCoord(1, 3)]: true,
      [asGridCoord(2, 3)]: true,
      [asGridCoord(5, 3)]: true,
      [asGridCoord(6, 3)]: true,
      [asGridCoord(8, 3)]: true,
      [asGridCoord(9, 3)]: true,
      [asGridCoord(10, 3)]: true,
      [asGridCoord(6, 2)]: true,
      [asGridCoord(7, 2)]: true,
      [asGridCoord(8, 2)]: true,
      [asGridCoord(0, 4)]: true,
      [asGridCoord(0, 5)]: true,
      [asGridCoord(0, 6)]: true,
      [asGridCoord(0, 7)]: true,
      [asGridCoord(0, 8)]: true,
      [asGridCoord(0, 9)]: true,
      [asGridCoord(1, 10)]: true,
      [asGridCoord(2, 10)]: true,
      [asGridCoord(3, 10)]: true,
      [asGridCoord(4, 10)]: true,
      [asGridCoord(6, 10)]: true,
      [asGridCoord(7, 10)]: true,
      [asGridCoord(8, 10)]: true,
      [asGridCoord(9, 10)]: true,
      [asGridCoord(10, 10)]: true,
      [asGridCoord(11, 4)]: true,
      [asGridCoord(11, 5)]: true,
      [asGridCoord(11, 6)]: true,
      [asGridCoord(11, 7)]: true,
      [asGridCoord(11, 8)]: true,
      [asGridCoord(11, 9)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(7, 4)]: [
        {
          events: [
            {
              who: GameObjectId.Erio,
              type: OverworldEventAction.Walk,
              direction: Direction.Left,
            },
            {
              who: GameObjectId.Erio,
              type: OverworldEventAction.Stand,
              direction: Direction.Up,
              time: 500,
            },
            {
              type: OverworldEventAction.TextMessage,
              text: "You can't be in here!",
            },
            {
              who: GameObjectId.Erio,
              type: OverworldEventAction.Walk,
              direction: Direction.Right,
            },
            {
              who: GameObjectId.Hero,
              type: OverworldEventAction.Walk,
              direction: Direction.Down,
            },
            {
              who: GameObjectId.Hero,
              type: OverworldEventAction.Walk,
              direction: Direction.Left,
            },
          ],
        },
      ],
      [asGridCoord(5, 10)]: [
        {
          events: [
            { type: OverworldEventAction.ChangeMap, map: MapId.Kitchen },
          ],
        },
      ],
    },
  },
  [MapId.Kitchen]: {
    lowerSrc: '../images/maps/kitchen-lower.png',
    upperSrc: '../images/maps/kitchen-upper.png',
    gameObjects: {
      [GameObjectId.Hero]: new Person({
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(5),
        isPlayerControlled: true,
      }),
      [GameObjectId.Npc3]: new Person({
        src: '../images/characters/people/npc3.png',
        x: withGrid(10),
        y: withGrid(8),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'You made it!',
                faceHero: GameObjectId.Npc3,
              },
            ],
          },
        ],
      }),
    },
    walls: {},
  },
};
