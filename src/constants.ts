import {
  Direction,
  GameObject,
  GameObjectAction,
  GameObjectName,
} from './GameObject';
import { MapAction } from './MapEvent';
import { MapName, OverworldMapConfig } from './OverworldMap';
import { Person } from './Person';
import { TextMessageAction } from './TextMessageEvent';
import { asGridCoord, withGrid } from './utils';

window.OVERWORLD_MAPS = {
  [MapName.DemoRoom]: {
    lowerSrc: '../images/maps/demo-lower.png',
    upperSrc: '../images/maps/demo-upper.png',
    gameObjects: {
      [GameObjectName.Hero]: new Person({
        src: '../images/characters/people/npc4.png',
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
      }),
      [GameObjectName.Npc1]: new Person({
        src: '../images/characters/people/npc1.png',
        x: withGrid(7),
        y: withGrid(9),
        behaviourLoop: [
          {
            type: GameObjectAction.Stand,
            direction: Direction.Left,
            time: 800,
          },
          {
            type: GameObjectAction.Stand,
            direction: Direction.Up,
            time: 800,
          },
          {
            type: GameObjectAction.Stand,
            direction: Direction.Right,
            time: 1200,
          },
          { type: GameObjectAction.Stand, direction: Direction.Up, time: 300 },
        ],
        talking: [
          {
            events: [
              {
                type: TextMessageAction.TextMessage,
                text: "I'm busy...",
                faceHero: GameObjectName.Npc1,
              },
              { type: TextMessageAction.TextMessage, text: 'Go away!' },
              {
                type: GameObjectAction.Walk,
                direction: Direction.Left,
                who: GameObjectName.Hero,
              },
              {
                type: GameObjectAction.Walk,
                direction: Direction.Up,
                who: GameObjectName.Hero,
              },
            ],
          },
        ],
      }),
      [GameObjectName.Npc2]: new Person({
        src: '../images/characters/people/npc2.png',
        x: withGrid(8),
        y: withGrid(5),
        // behaviourLoop: [
        //   {
        //     type: GameObjectAction.Walk,
        //     direction: Direction.Left,
        //   },
        //   {
        //     type: GameObjectAction.Stand,
        //     direction: Direction.Up,
        //     time: 800,
        //   },
        //   {
        //     type: GameObjectAction.Walk,
        //     direction: Direction.Up,
        //   },
        //   {
        //     type: GameObjectAction.Walk,
        //     direction: Direction.Right,
        //   },
        //   {
        //     type: GameObjectAction.Walk,
        //     direction: Direction.Down,
        //   },
        // ],
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
    },
    cutsceneSpaces: {
      [asGridCoord(7, 4)]: [
        {
          events: [
            {
              who: GameObjectName.Npc2,
              type: GameObjectAction.Walk,
              direction: Direction.Left,
            },
            {
              who: GameObjectName.Npc2,
              type: GameObjectAction.Stand,
              direction: Direction.Up,
              time: 500,
            },
            {
              type: TextMessageAction.TextMessage,
              text: "You can't be in here!",
            },
            {
              who: GameObjectName.Npc2,
              type: GameObjectAction.Walk,
              direction: Direction.Right,
            },
            {
              who: GameObjectName.Hero,
              type: GameObjectAction.Walk,
              direction: Direction.Down,
            },
            {
              who: GameObjectName.Hero,
              type: GameObjectAction.Walk,
              direction: Direction.Left,
            },
          ],
        },
      ],
      [asGridCoord(5, 10)]: [
        {
          events: [{ type: MapAction.ChangeMap, map: MapName.Kitchen }],
        },
      ],
    },
  },
  [MapName.Kitchen]: {
    lowerSrc: '../images/maps/kitchen-lower.png',
    upperSrc: '../images/maps/kitchen-upper.png',
    gameObjects: {
      [GameObjectName.Hero]: new Person({
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(5),
        isPlayerControlled: true,
      }),
      [GameObjectName.Npc3]: new Person({
        src: '../images/characters/people/npc3.png',
        x: withGrid(10),
        y: withGrid(8),
        talking: [
          {
            events: [
              {
                type: TextMessageAction.TextMessage,
                text: 'You made it!',
                faceHero: GameObjectName.Npc3,
              },
            ],
          },
        ],
      }),
    },
    walls: {},
  },
};
