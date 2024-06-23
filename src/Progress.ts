import { Direction } from './GameObject';
import { MapId } from './OverworldMap';
import { PlayerPizza, PlayerPizzaId, StoryFlag } from './State/PlayerState';
import { BattleActionItem } from './constants/BATLE_ACTIONS';

export interface ProgressPayload {
  mapId: MapId;
  startingHeroX: number;
  startingHeroY: number;
  startingHeroDirection: Direction;
  playerState: {
    pizzas: Record<PlayerPizzaId, PlayerPizza>;
    lineup: PlayerPizzaId[];
    items: BattleActionItem[];
    storyFlags: Partial<Record<StoryFlag, boolean>>;
  };
}

export class Progress {
  mapId: MapId;
  startingHeroX: number;
  startingHeroY: number;
  startingHeroDirection: Direction;
  saveFileKey: string;

  constructor() {
    this.mapId = MapId.DemoRoom;
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = Direction.Down;
    this.saveFileKey = 'PizzaLegends_SaveFile1';
  }

  save() {
    const payload: ProgressPayload = {
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        pizzas: window.playerState.pizzas,
        lineup: window.playerState.lineup,
        items: window.playerState.items,
        storyFlags: window.playerState.storyFlags,
      },
    };

    window.localStorage.setItem(this.saveFileKey, JSON.stringify(payload));
  }

  getSaveFile(): ProgressPayload | null {
    const file = window.localStorage.getItem(this.saveFileKey);

    return file ? (JSON.parse(file) as ProgressPayload) : null;
  }

  load() {
    const file = this.getSaveFile();

    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;

      window.playerState.pizzas = file.playerState.pizzas;
      window.playerState.lineup = file.playerState.lineup;
      window.playerState.items = file.playerState.items;
      window.playerState.storyFlags = file.playerState.storyFlags;
    }
  }
}
