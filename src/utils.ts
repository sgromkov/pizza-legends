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

export enum EventName {
  PersonWalkingComplete = 'PersonWalkingComplete',
  PersonStandComplete = 'PersonStandComplete',
}

export function emitEvent(
  name: EventName,
  detail: Record<string, unknown>
): void {
  const event = new CustomEvent(name, { detail });

  document.dispatchEvent(event);
}

export function getOppositeDirection(direction: Direction): Direction {
  let oppositeDirection: Direction;

  switch (direction) {
    case Direction.Left:
      oppositeDirection = Direction.Up;
      break;
    case Direction.Right:
      oppositeDirection = Direction.Left;
      break;
    case Direction.Up:
      oppositeDirection = Direction.Down;
      break;
    case Direction.Down:
      oppositeDirection = Direction.Up;
      break;
  }

  return oppositeDirection;
}
