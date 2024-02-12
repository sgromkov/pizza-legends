import { Direction } from './GameObject';

export function withGrid(n: number): number {
  return n * 16;
}

export function asGridCoord(x: number, y: number): string {
  return `${x * 16},${y * 16}`;
}

export function nextPosition(
  initialX: number,
  initialY: number,
  direction: Direction
): { x: number; y: number } {
  let x = initialX;
  let y = initialY;
  const size = 16;

  switch (direction) {
    case Direction.Left:
      x -= size;
      break;
    case Direction.Right:
      x += size;
      break;
    case Direction.Up:
      y -= size;
      break;
    case Direction.Down:
      y += size;
      break;
  }

  return { x, y };
}

export enum eventName {
  PersonWalkingComplete = 'PersonWalkingComplete',
  PersonStandComplete = 'PersonStandComplete',
}

export function emitEvent(
  name: eventName,
  detail: Record<string, unknown>
): void {
  const event = new CustomEvent(name, { detail });

  document.dispatchEvent(event);
}
