import {
  Direction,
  GameObject,
  GameObjectId,
  GameObjetcType,
} from '../GameObject';
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
    id: MapId.DemoRoom,
    lowerSrc: '../images/maps/demo-lower.png',
    upperSrc: '../images/maps/demo-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
      },
      [GameObjectId.DemoRoomNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc1.png',
        x: withGrid(7),
        y: withGrid(9),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
        ],
        talking: [
          {
            required: [StoryFlag.TalkToErio],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "Isn't Erio the coolest?",
                faceHero: GameObjectId.DemoRoomNpc1,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "I'm going to crush you!",
                faceHero: GameObjectId.DemoRoomNpc1,
              },
              { type: OverworldEventAction.Battle, enemyId: EnemyId.Beth },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.DefeatedBeth,
              },
              {
                type: OverworldEventAction.TextMessage,
                text: 'You crushed me.',
                faceHero: GameObjectId.DemoRoomNpc1,
              },
            ],
          },
        ],
      },
      [GameObjectId.DemoRoomNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc6.png',
        x: withGrid(8),
        y: withGrid(5),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Hello!',
                faceHero: GameObjectId.DemoRoomNpc2,
              },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.TalkToErio,
              },
            ],
          },
        ],
      },
      [GameObjectId.DemoRoomPizzaStone]: {
        type: GameObjetcType.PizzaStone,
        x: withGrid(2),
        y: withGrid(7),
        storyFlag: StoryFlag.UsedPizzaStone,
        pizzas: [PizzaId.V001, PizzaId.F001],
      },
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
              who: GameObjectId.DemoRoomNpc2,
              type: OverworldEventAction.Walk,
              direction: Direction.Left,
            },
            {
              who: GameObjectId.DemoRoomNpc2,
              type: OverworldEventAction.Stand,
              direction: Direction.Up,
              time: 500,
            },
            {
              type: OverworldEventAction.TextMessage,
              text: "You can't be in here!",
            },
            {
              who: GameObjectId.DemoRoomNpc2,
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
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Street,
              x: withGrid(25),
              y: withGrid(5),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
  },
  [MapId.Kitchen]: {
    id: MapId.Kitchen,
    lowerSrc: '../images/maps/kitchen-lower.png',
    upperSrc: '../images/maps/kitchen-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(10),
        y: withGrid(5),
        isPlayerControlled: true,
      },
      [GameObjectId.KitchenNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc8.png',
        x: withGrid(9),
        y: withGrid(5),
        direction: Direction.Up,
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "** They don't want to talk to you **",
              },
            ],
          },
        ],
      },
      [GameObjectId.KitchenNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc3.png',
        x: withGrid(3),
        y: withGrid(6),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'People take their jobs here very seriously.',
                faceHero: GameObjectId.KitchenNpc2,
              },
            ],
          },
        ],
      },
    },
    cutsceneSpaces: {
      [asGridCoord(5, 10)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.DiningRoom,
              x: withGrid(7),
              y: withGrid(3),
              direction: Direction.Down,
            },
          ],
        },
      ],
      [asGridCoord(10, 6)]: [
        {
          disqualify: [StoryFlag.SeenIntro],
          events: [
            {
              type: OverworldEventAction.AddStoryFlag,
              flag: StoryFlag.SeenIntro,
            },
            {
              type: OverworldEventAction.TextMessage,
              text: '* You are chopping ingredients on your first day as a Pizza Chef at a famed establishment in town. *',
            },
            {
              type: OverworldEventAction.Walk,
              who: GameObjectId.KitchenNpc1,
              direction: Direction.Down,
            },
            {
              type: OverworldEventAction.Stand,
              who: GameObjectId.KitchenNpc1,
              direction: Direction.Right,
              time: 200,
            },
            {
              type: OverworldEventAction.Stand,
              who: GameObjectId.Hero,
              direction: Direction.Left,
              time: 200,
            },
            {
              type: OverworldEventAction.TextMessage,
              text: 'Ahem. Is this your best work?',
            },
            {
              type: OverworldEventAction.TextMessage,
              text: 'These pepperonis are completely unstable! The pepper shapes are all wrong!',
            },
            {
              type: OverworldEventAction.TextMessage,
              text: "Don't even get me started on the mushrooms.",
            },
            {
              type: OverworldEventAction.TextMessage,
              text: 'You will never make it in pizza!',
            },
            {
              type: OverworldEventAction.Stand,
              who: GameObjectId.KitchenNpc1,
              direction: Direction.Right,
              time: 200,
            },
            {
              type: OverworldEventAction.Walk,
              who: GameObjectId.KitchenNpc1,
              direction: Direction.Up,
            },
            {
              type: OverworldEventAction.Stand,
              who: GameObjectId.KitchenNpc1,
              direction: Direction.Up,
              time: 300,
            },
            {
              type: OverworldEventAction.Stand,
              who: GameObjectId.Hero,
              direction: Direction.Down,
              time: 400,
            },
            {
              type: OverworldEventAction.TextMessage,
              text: '* The competition is fierce! You should spend some time leveling up your Pizza lineup and skills. *',
            },
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Street,
              x: withGrid(5),
              y: withGrid(10),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
    walls: {
      [asGridCoord(2, 4)]: true,
      [asGridCoord(3, 4)]: true,
      [asGridCoord(5, 4)]: true,
      [asGridCoord(6, 4)]: true,
      [asGridCoord(7, 4)]: true,
      [asGridCoord(8, 4)]: true,
      [asGridCoord(11, 4)]: true,
      [asGridCoord(11, 5)]: true,
      [asGridCoord(12, 5)]: true,
      [asGridCoord(1, 5)]: true,
      [asGridCoord(1, 6)]: true,
      [asGridCoord(1, 7)]: true,
      [asGridCoord(1, 9)]: true,
      [asGridCoord(2, 9)]: true,
      [asGridCoord(6, 7)]: true,
      [asGridCoord(7, 7)]: true,
      [asGridCoord(9, 7)]: true,
      [asGridCoord(10, 7)]: true,
      [asGridCoord(9, 9)]: true,
      [asGridCoord(10, 9)]: true,
      [asGridCoord(3, 10)]: true,
      [asGridCoord(4, 10)]: true,
      [asGridCoord(6, 10)]: true,
      [asGridCoord(7, 10)]: true,
      [asGridCoord(8, 10)]: true,
      [asGridCoord(11, 10)]: true,
      [asGridCoord(12, 10)]: true,

      [asGridCoord(0, 8)]: true,
      [asGridCoord(5, 11)]: true,

      [asGridCoord(4, 3)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(10, 4)]: true,

      [asGridCoord(13, 6)]: true,
      [asGridCoord(13, 7)]: true,
      [asGridCoord(13, 8)]: true,
      [asGridCoord(13, 9)]: true,
    },
  },
  [MapId.Street]: {
    id: MapId.Street,
    lowerSrc: '../images/maps/street-lower.png',
    upperSrc: '../images/maps/street-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(30),
        y: withGrid(10),
        isPlayerControlled: true,
      },
      [GameObjectId.StreetNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc2.png',
        x: withGrid(9),
        y: withGrid(11),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 1600,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'All ambitious pizza chefs gather on Anchovy Avenue.',
                faceHero: GameObjectId.StreetNpc1,
              },
            ],
          },
        ],
      },
      [GameObjectId.StreetNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc7.png',
        x: withGrid(31),
        y: withGrid(12),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "I can't decide on my favorite toppings.",
                faceHero: GameObjectId.StreetNpc2,
              },
            ],
          },
        ],
      },
      [GameObjectId.StreetNorthNpc3]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc8.png',
        x: withGrid(22),
        y: withGrid(10),
        talking: [
          {
            required: [StoryFlag.StreetBattle],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'You are quite capable.',
                faceHero: GameObjectId.StreetNorthNpc3,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'You should have just stayed home!',
                faceHero: GameObjectId.StreetNorthNpc3,
              },
              { type: OverworldEventAction.Battle, enemyId: EnemyId.Beth },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.StreetBattle,
              },
            ],
          },
        ],
      },
    },
    walls: {
      [asGridCoord(4, 9)]: true,
      [asGridCoord(5, 8)]: true,
      [asGridCoord(6, 9)]: true,
      [asGridCoord(7, 9)]: true,
      [asGridCoord(8, 9)]: true,
      [asGridCoord(9, 9)]: true,
      [asGridCoord(10, 9)]: true,
      [asGridCoord(11, 9)]: true,
      [asGridCoord(12, 9)]: true,
      [asGridCoord(13, 8)]: true,
      [asGridCoord(14, 8)]: true,
      [asGridCoord(15, 7)]: true,
      [asGridCoord(16, 7)]: true,
      [asGridCoord(17, 7)]: true,
      [asGridCoord(18, 7)]: true,
      [asGridCoord(19, 7)]: true,
      [asGridCoord(20, 7)]: true,
      [asGridCoord(21, 7)]: true,
      [asGridCoord(22, 7)]: true,
      [asGridCoord(23, 7)]: true,
      [asGridCoord(24, 7)]: true,
      [asGridCoord(24, 6)]: true,
      [asGridCoord(24, 5)]: true,
      [asGridCoord(26, 5)]: true,
      [asGridCoord(26, 6)]: true,
      [asGridCoord(26, 7)]: true,
      [asGridCoord(27, 7)]: true,
      [asGridCoord(28, 8)]: true,
      [asGridCoord(28, 9)]: true,
      [asGridCoord(29, 8)]: true,
      [asGridCoord(30, 9)]: true,
      [asGridCoord(31, 9)]: true,
      [asGridCoord(32, 9)]: true,
      [asGridCoord(33, 9)]: true,
      [asGridCoord(16, 9)]: true,
      [asGridCoord(17, 9)]: true,
      [asGridCoord(25, 9)]: true,
      [asGridCoord(26, 9)]: true,
      [asGridCoord(16, 10)]: true,
      [asGridCoord(17, 10)]: true,
      [asGridCoord(25, 10)]: true,
      [asGridCoord(26, 10)]: true,
      [asGridCoord(16, 11)]: true,
      [asGridCoord(17, 11)]: true,
      [asGridCoord(25, 11)]: true,
      [asGridCoord(26, 11)]: true,
      [asGridCoord(18, 11)]: true,
      [asGridCoord(19, 11)]: true,
      [asGridCoord(4, 14)]: true,
      [asGridCoord(5, 14)]: true,
      [asGridCoord(6, 14)]: true,
      [asGridCoord(7, 14)]: true,
      [asGridCoord(8, 14)]: true,
      [asGridCoord(9, 14)]: true,
      [asGridCoord(10, 14)]: true,
      [asGridCoord(11, 14)]: true,
      [asGridCoord(12, 14)]: true,
      [asGridCoord(13, 14)]: true,
      [asGridCoord(14, 14)]: true,
      [asGridCoord(15, 14)]: true,
      [asGridCoord(16, 14)]: true,
      [asGridCoord(17, 14)]: true,
      [asGridCoord(18, 14)]: true,
      [asGridCoord(19, 14)]: true,
      [asGridCoord(20, 14)]: true,
      [asGridCoord(21, 14)]: true,
      [asGridCoord(22, 14)]: true,
      [asGridCoord(23, 14)]: true,
      [asGridCoord(24, 14)]: true,
      [asGridCoord(25, 14)]: true,
      [asGridCoord(26, 14)]: true,
      [asGridCoord(27, 14)]: true,
      [asGridCoord(28, 14)]: true,
      [asGridCoord(29, 14)]: true,
      [asGridCoord(30, 14)]: true,
      [asGridCoord(31, 14)]: true,
      [asGridCoord(32, 14)]: true,
      [asGridCoord(33, 14)]: true,
      [asGridCoord(3, 10)]: true,
      [asGridCoord(3, 11)]: true,
      [asGridCoord(3, 12)]: true,
      [asGridCoord(3, 13)]: true,
      [asGridCoord(34, 10)]: true,
      [asGridCoord(34, 11)]: true,
      [asGridCoord(34, 12)]: true,
      [asGridCoord(34, 13)]: true,
      [asGridCoord(29, 8)]: true,
      [asGridCoord(25, 4)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(5, 9)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.DiningRoom,
              x: withGrid(6),
              y: withGrid(12),
              direction: Direction.Up,
            },
          ],
        },
      ],
      [asGridCoord(29, 9)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Shop,
              x: withGrid(5),
              y: withGrid(12),
              direction: Direction.Up,
            },
          ],
        },
      ],
      [asGridCoord(25, 5)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.StreetNorth,
              x: withGrid(7),
              y: withGrid(16),
              direction: Direction.Up,
            },
          ],
        },
      ],
    },
  },
  [MapId.Shop]: {
    id: MapId.Shop,
    lowerSrc: '../images/maps/pizza-shop-lower.png',
    upperSrc: '../images/maps/pizza-shop-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(3),
        y: withGrid(7),
        isPlayerControlled: true,
      },
      [GameObjectId.ShopNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc6.png',
        x: withGrid(6),
        y: withGrid(5),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'All of the chef rivalries have been good for business.',
                faceHero: GameObjectId.ShopNpc1,
              },
            ],
          },
        ],
      },
      [GameObjectId.ShopNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc2.png',
        x: withGrid(5),
        y: withGrid(9),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Which peel will make me a better chef?',
                faceHero: GameObjectId.ShopNpc2,
              },
            ],
          },
        ],
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 400,
          },
        ],
      },
      [GameObjectId.ShopPizzaStone]: {
        type: GameObjetcType.PizzaStone,
        x: withGrid(1),
        y: withGrid(4),
        storyFlag: StoryFlag.StoneShop,
        pizzas: [PizzaId.V002, PizzaId.F002],
      },
    },
    walls: {
      [asGridCoord(2, 4)]: true,
      [asGridCoord(2, 5)]: true,
      [asGridCoord(2, 6)]: true,
      [asGridCoord(3, 6)]: true,
      [asGridCoord(4, 6)]: true,
      [asGridCoord(5, 6)]: true,
      [asGridCoord(7, 6)]: true,
      [asGridCoord(8, 6)]: true,
      [asGridCoord(9, 6)]: true,
      [asGridCoord(9, 5)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(3, 8)]: true,
      [asGridCoord(3, 9)]: true,
      [asGridCoord(3, 10)]: true,
      [asGridCoord(4, 8)]: true,
      [asGridCoord(4, 9)]: true,
      [asGridCoord(4, 10)]: true,
      [asGridCoord(7, 8)]: true,
      [asGridCoord(7, 9)]: true,
      [asGridCoord(8, 8)]: true,
      [asGridCoord(8, 9)]: true,
      [asGridCoord(1, 12)]: true,
      [asGridCoord(2, 12)]: true,
      [asGridCoord(3, 12)]: true,
      [asGridCoord(4, 12)]: true,
      [asGridCoord(6, 12)]: true,
      [asGridCoord(7, 12)]: true,
      [asGridCoord(8, 12)]: true,
      [asGridCoord(9, 12)]: true,
      [asGridCoord(10, 12)]: true,
      [asGridCoord(0, 4)]: true,
      [asGridCoord(0, 5)]: true,
      [asGridCoord(0, 6)]: true,
      [asGridCoord(0, 7)]: true,
      [asGridCoord(0, 8)]: true,
      [asGridCoord(0, 9)]: true,
      [asGridCoord(0, 10)]: true,
      [asGridCoord(0, 11)]: true,
      [asGridCoord(11, 4)]: true,
      [asGridCoord(11, 5)]: true,
      [asGridCoord(11, 6)]: true,
      [asGridCoord(11, 7)]: true,
      [asGridCoord(11, 8)]: true,
      [asGridCoord(11, 9)]: true,
      [asGridCoord(11, 10)]: true,
      [asGridCoord(11, 11)]: true,

      [asGridCoord(1, 3)]: true,
      [asGridCoord(2, 3)]: true,
      [asGridCoord(3, 3)]: true,
      [asGridCoord(4, 3)]: true,
      [asGridCoord(5, 3)]: true,
      [asGridCoord(6, 3)]: true,
      [asGridCoord(7, 3)]: true,
      [asGridCoord(8, 3)]: true,
      [asGridCoord(9, 3)]: true,
      [asGridCoord(10, 3)]: true,

      [asGridCoord(5, 13)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(5, 12)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Street,
              x: withGrid(29),
              y: withGrid(9),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
  },
  [MapId.GreenKitchen]: {
    id: MapId.GreenKitchen,
    lowerSrc: '../images/maps/green-kitchen-lower.png',
    upperSrc: '../images/maps/green-kitchen-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(3),
        y: withGrid(8),
        isPlayerControlled: true,
      },
      [GameObjectId.GreenKitchenNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc2.png',
        x: withGrid(8),
        y: withGrid(8),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Chef Rootie uses the best seasoning.',
                faceHero: GameObjectId.GreenKitchenNpc1,
              },
            ],
          },
        ],
      },
      [GameObjectId.GreenKitchenNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc3.png',
        x: withGrid(1),
        y: withGrid(8),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Down,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Down,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Up,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Up,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Finally... a pizza place that gets me!',
                faceHero: GameObjectId.GreenKitchenNpc2,
              },
            ],
          },
        ],
      },
      [GameObjectId.GreenKitchenBoss]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/second-boss.png',
        x: withGrid(3),
        y: withGrid(5),
        talking: [
          {
            required: [StoryFlag.ChefRootie],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'My veggies need more growth.',
                faceHero: GameObjectId.GreenKitchenBoss,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Veggies are the fuel for the heart and soul!',
                faceHero: GameObjectId.GreenKitchenNpc1,
              },
              {
                type: OverworldEventAction.Battle,
                enemyId: EnemyId.ChefRootie,
                // arena: "green-kitchen"
              },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.ChefRootie,
              },
            ],
          },
        ],
      },
    },
    walls: {
      [asGridCoord(1, 4)]: true,
      [asGridCoord(3, 4)]: true,
      [asGridCoord(4, 4)]: true,
      [asGridCoord(6, 4)]: true,
      [asGridCoord(7, 4)]: true,
      [asGridCoord(8, 5)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(1, 6)]: true,
      [asGridCoord(2, 6)]: true,
      [asGridCoord(3, 6)]: true,
      [asGridCoord(4, 6)]: true,
      [asGridCoord(5, 6)]: true,
      [asGridCoord(6, 6)]: true,
      [asGridCoord(3, 7)]: true,
      [asGridCoord(4, 7)]: true,
      [asGridCoord(6, 7)]: true,
      [asGridCoord(2, 9)]: true,
      [asGridCoord(3, 9)]: true,
      [asGridCoord(4, 9)]: true,
      [asGridCoord(7, 10)]: true,
      [asGridCoord(8, 10)]: true,
      [asGridCoord(9, 10)]: true,
      [asGridCoord(1, 12)]: true,
      [asGridCoord(2, 12)]: true,
      [asGridCoord(3, 12)]: true,
      [asGridCoord(4, 12)]: true,
      [asGridCoord(6, 12)]: true,
      [asGridCoord(7, 12)]: true,
      [asGridCoord(8, 12)]: true,
      [asGridCoord(9, 12)]: true,
      [asGridCoord(0, 5)]: true,
      [asGridCoord(0, 6)]: true,
      [asGridCoord(0, 7)]: true,
      [asGridCoord(0, 8)]: true,
      [asGridCoord(0, 9)]: true,
      [asGridCoord(0, 10)]: true,
      [asGridCoord(0, 11)]: true,
      [asGridCoord(10, 5)]: true,
      [asGridCoord(10, 6)]: true,
      [asGridCoord(10, 7)]: true,
      [asGridCoord(10, 8)]: true,
      [asGridCoord(10, 9)]: true,
      [asGridCoord(10, 10)]: true,
      [asGridCoord(10, 11)]: true,
      [asGridCoord(5, 13)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(5, 12)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.StreetNorth,
              x: withGrid(7),
              y: withGrid(5),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
  },
  [MapId.StreetNorth]: {
    id: MapId.StreetNorth,
    lowerSrc: '../images/maps/street-north-lower.png',
    upperSrc: '../images/maps/street-north-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(3),
        y: withGrid(8),
        isPlayerControlled: true,
      },
      [GameObjectId.StreetNorthNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc1.png',
        x: withGrid(9),
        y: withGrid(6),
        behaviourLoop: [
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Left,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Down,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Right,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
          {
            type: OverworldEventAction.Walk,
            direction: Direction.Up,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'This place is famous for veggie pizzas!',
                faceHero: GameObjectId.StreetNorthNpc1,
              },
            ],
          },
        ],
      },
      [GameObjectId.StreetNorthNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc3.png',
        x: withGrid(4),
        y: withGrid(12),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3200,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3200,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'I love the fresh smell of garlic in the air.',
                faceHero: GameObjectId.StreetNorthNpc2,
              },
            ],
          },
        ],
      },
      [GameObjectId.StreetNorthNpc3]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc8.png',
        x: withGrid(12),
        y: withGrid(9),
        talking: [
          {
            required: [StoryFlag.StreetNorthBattle],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Could you be the Legendary one?',
                faceHero: GameObjectId.StreetNorthNpc3,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'This is my turf!',
                faceHero: GameObjectId.StreetNorthNpc3,
              },
              {
                type: OverworldEventAction.Battle,
                enemyId: EnemyId.StreetNorthBattle,
              },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.StreetNorthBattle,
              },
            ],
          },
        ],
      },
      [GameObjectId.StreetNorthPizzaStone]: {
        type: GameObjetcType.PizzaStone,
        x: withGrid(2),
        y: withGrid(9),
        storyFlag: StoryFlag.StoneStreetNorth,
        pizzas: [PizzaId.V001, PizzaId.F001],
      },
    },
    walls: {
      [asGridCoord(2, 7)]: true,
      [asGridCoord(3, 7)]: true,
      [asGridCoord(3, 6)]: true,
      [asGridCoord(4, 5)]: true,
      [asGridCoord(5, 5)]: true,
      [asGridCoord(6, 5)]: true,
      [asGridCoord(8, 5)]: true,
      [asGridCoord(9, 5)]: true,
      [asGridCoord(10, 5)]: true,
      [asGridCoord(11, 6)]: true,
      [asGridCoord(12, 6)]: true,
      [asGridCoord(13, 6)]: true,
      [asGridCoord(7, 8)]: true,
      [asGridCoord(8, 8)]: true,
      [asGridCoord(7, 9)]: true,
      [asGridCoord(8, 9)]: true,
      [asGridCoord(7, 10)]: true,
      [asGridCoord(8, 10)]: true,
      [asGridCoord(9, 10)]: true,
      [asGridCoord(10, 10)]: true,
      [asGridCoord(2, 15)]: true,
      [asGridCoord(3, 15)]: true,
      [asGridCoord(4, 15)]: true,
      [asGridCoord(5, 15)]: true,
      [asGridCoord(6, 15)]: true,
      [asGridCoord(6, 16)]: true,
      [asGridCoord(8, 16)]: true,
      [asGridCoord(8, 15)]: true,
      [asGridCoord(9, 15)]: true,
      [asGridCoord(10, 15)]: true,
      [asGridCoord(11, 15)]: true,
      [asGridCoord(12, 15)]: true,
      [asGridCoord(13, 15)]: true,

      [asGridCoord(1, 8)]: true,
      [asGridCoord(1, 9)]: true,
      [asGridCoord(1, 10)]: true,
      [asGridCoord(1, 11)]: true,
      [asGridCoord(1, 12)]: true,
      [asGridCoord(1, 13)]: true,
      [asGridCoord(1, 14)]: true,

      [asGridCoord(14, 7)]: true,
      [asGridCoord(14, 8)]: true,
      [asGridCoord(14, 9)]: true,
      [asGridCoord(14, 10)]: true,
      [asGridCoord(14, 11)]: true,
      [asGridCoord(14, 12)]: true,
      [asGridCoord(14, 13)]: true,
      [asGridCoord(14, 14)]: true,

      [asGridCoord(7, 17)]: true,
      [asGridCoord(7, 4)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(7, 5)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.GreenKitchen,
              x: withGrid(5),
              y: withGrid(12),
              direction: Direction.Up,
            },
          ],
        },
      ],
      [asGridCoord(7, 16)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Street,
              x: withGrid(25),
              y: withGrid(5),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
  },
  [MapId.DiningRoom]: {
    id: MapId.DiningRoom,
    lowerSrc: '../images/maps/dining-room-lower.png',
    upperSrc: '../images/maps/dining-room-upper.png',
    configObjects: {
      [GameObjectId.Hero]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(8),
        isPlayerControlled: true,
      },
      [GameObjectId.DiningRoomNpc1]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc8.png',
        x: withGrid(12),
        y: withGrid(8),
        talking: [
          {
            required: [StoryFlag.DiningRoomBattle],
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'Maybe I am not ready for this place.',
                faceHero: GameObjectId.DiningRoomNpc1,
              },
            ],
          },
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'You think you have what it takes to cook here?!',
                faceHero: GameObjectId.DiningRoomNpc1,
              },
              {
                type: OverworldEventAction.Battle,
                enemyId: EnemyId.DiningRoomBattle,
                // arena: "dining-room"
              },
              {
                type: OverworldEventAction.AddStoryFlag,
                flag: StoryFlag.DiningRoomBattle,
              },
            ],
          },
        ],
      },
      [GameObjectId.DiningRoomNpc2]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc4.png',
        x: withGrid(9),
        y: withGrid(5),
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'People come from all over to dine here.',
                faceHero: GameObjectId.DiningRoomNpc2,
              },
            ],
          },
        ],
      },
      [GameObjectId.DiningRoomNpc3]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc7.png',
        x: withGrid(9),
        y: withGrid(5),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3600,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: 'I was so lucky to score a reservation!',
                faceHero: GameObjectId.DiningRoomNpc3,
              },
            ],
          },
        ],
      },
      [GameObjectId.DiningRoomNpc4]: {
        type: GameObjetcType.Person,
        src: '../images/characters/people/npc1.png',
        x: withGrid(8),
        y: withGrid(9),
        behaviourLoop: [
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Left,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Down,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Right,
            time: 3600,
          },
          {
            type: OverworldEventAction.Stand,
            direction: Direction.Up,
            time: 3600,
          },
        ],
        talking: [
          {
            events: [
              {
                type: OverworldEventAction.TextMessage,
                text: "I've been dreaming of this pizza for weeks!",
                faceHero: GameObjectId.DiningRoomNpc4,
              },
            ],
          },
        ],
      },
    },
    walls: {
      [asGridCoord(7, 2)]: true,
      [asGridCoord(6, 13)]: true,
      [asGridCoord(1, 5)]: true,
      [asGridCoord(2, 5)]: true,
      [asGridCoord(3, 5)]: true,
      [asGridCoord(4, 5)]: true,
      [asGridCoord(4, 4)]: true,
      [asGridCoord(5, 3)]: true,
      [asGridCoord(6, 4)]: true,
      [asGridCoord(6, 5)]: true,
      [asGridCoord(8, 3)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(10, 5)]: true,
      [asGridCoord(11, 5)]: true,
      [asGridCoord(12, 5)]: true,
      [asGridCoord(11, 7)]: true,
      [asGridCoord(12, 7)]: true,
      [asGridCoord(2, 7)]: true,
      [asGridCoord(3, 7)]: true,
      [asGridCoord(4, 7)]: true,
      [asGridCoord(7, 7)]: true,
      [asGridCoord(8, 7)]: true,
      [asGridCoord(9, 7)]: true,
      [asGridCoord(2, 10)]: true,
      [asGridCoord(3, 10)]: true,
      [asGridCoord(4, 10)]: true,
      [asGridCoord(7, 10)]: true,
      [asGridCoord(8, 10)]: true,
      [asGridCoord(9, 10)]: true,
      [asGridCoord(1, 12)]: true,
      [asGridCoord(2, 12)]: true,
      [asGridCoord(3, 12)]: true,
      [asGridCoord(4, 12)]: true,
      [asGridCoord(5, 12)]: true,
      [asGridCoord(7, 12)]: true,
      [asGridCoord(8, 12)]: true,
      [asGridCoord(9, 12)]: true,
      [asGridCoord(10, 12)]: true,
      [asGridCoord(11, 12)]: true,
      [asGridCoord(12, 12)]: true,
      [asGridCoord(0, 4)]: true,
      [asGridCoord(0, 5)]: true,
      [asGridCoord(0, 6)]: true,
      [asGridCoord(0, 8)]: true,
      [asGridCoord(0, 9)]: true,
      [asGridCoord(0, 10)]: true,
      [asGridCoord(0, 11)]: true,
      [asGridCoord(13, 4)]: true,
      [asGridCoord(13, 5)]: true,
      [asGridCoord(13, 6)]: true,
      [asGridCoord(13, 8)]: true,
      [asGridCoord(13, 9)]: true,
      [asGridCoord(13, 10)]: true,
      [asGridCoord(13, 11)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(7, 3)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Kitchen,
              x: withGrid(5),
              y: withGrid(10),
              direction: Direction.Up,
            },
          ],
        },
      ],
      [asGridCoord(6, 12)]: [
        {
          events: [
            {
              type: OverworldEventAction.ChangeMap,
              map: MapId.Street,
              x: withGrid(5),
              y: withGrid(9),
              direction: Direction.Down,
            },
          ],
        },
      ],
    },
  },
};
