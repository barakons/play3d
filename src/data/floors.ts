import { DEFAULT_LAYOUT, type BuildingLayout } from './layout';
import { floorIdFor, roomsByFloor } from './rooms';
import type { Floor } from '../types/school';

export function getFloors(layout: BuildingLayout = DEFAULT_LAYOUT): Floor[] {
  return Array.from({ length: layout.floorCount }, (_, i) => {
    const level = i + 1;
    return {
      id: floorIdFor(level),
      buildingId: 'A',
      level,
      name: `Floor ${level}`,
      rooms: roomsByFloor(level),
    };
  });
}

export const floors: Floor[] = getFloors();
