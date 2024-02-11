import { GameObject } from './GameObject';
import { OverworldMapConfig } from './OverworldMap';
import { Person } from './Person';
import { asGridCoord, withGrid } from './utils';

export const OVERWORLD_MAPS = <Record<string, OverworldMapConfig>>{
  DemoRoom: {
    lowerSrc: '../images/maps/demo-lower.png',
    upperSrc: '../images/maps/demo-upper.png',
    gameObjects: {
      hero: new Person({
        src: '../images/characters/people/hero.png',
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
      }),
      npc1: new Person({
        src: '../images/characters/people/npc1.png',
        x: withGrid(4),
        y: withGrid(9),
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
  },
  Kitchen: {
    lowerSrc: '../images/maps/kitchen-lower.png',
    upperSrc: '../images/maps/kitchen-upper.png',
    gameObjects: {
      hero: new Person({
        src: '../images/characters/people/hero.png',
        x: withGrid(3),
        y: withGrid(5),
        isPlayerControlled: true,
      }),
      npc2: new Person({
        src: '../images/characters/people/npc2.png',
        x: withGrid(9),
        y: withGrid(6),
      }),
      npc3: new Person({
        src: '../images/characters/people/npc3.png',
        x: withGrid(10),
        y: withGrid(8),
      }),
    },
    walls: {},
  },
};
