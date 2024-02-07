import { GameObject } from './GameObject';
import { OverworldMapConfig } from './OverworldMap';
import { Person } from './Person';
import { withGrid } from './utils';

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
  },
};
