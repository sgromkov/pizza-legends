import { MapName, OverworldMapConfig } from '../OverworldMap';

export {};

declare global {
  interface Window {
    OVERWORLD_MAPS: Record<MapName, OverworldMapConfig>;
  }
}
