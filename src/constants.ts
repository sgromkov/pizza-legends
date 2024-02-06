import { GameObject } from './GameObject';
import { OverworldMapConfig } from './OverworldMap';

export const OVERWORLD_MAPS = <Record<string, OverworldMapConfig>>{
  DemoRoom: {
    lowerSrc: '../images/maps/demo-lower.png',
    upperSrc: '../images/maps/demo-upper.png',
    gameObjects: {
      hero: new GameObject({
        src: '../images/characters/people/hero.png',
        x: 5,
        y: 6,
      }),
      npc1: new GameObject({
        src: '../images/characters/people/npc1.png',
        x: 4,
        y: 9,
      }),
    },
  },
  Kitchen: {
    lowerSrc: '../images/maps/kitchen-lower.png',
    upperSrc: '../images/maps/kitchen-upper.png',
    gameObjects: {
      hero: new GameObject({
        src: '../images/characters/people/hero.png',
        x: 3,
        y: 5,
      }),
      npc2: new GameObject({
        src: '../images/characters/people/npc2.png',
        x: 9,
        y: 6,
      }),
      npc3: new GameObject({
        src: '../images/characters/people/npc3.png',
        x: 10,
        y: 8,
      }),
    },
  },
};
