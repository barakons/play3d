import { DEFAULT_LAYOUT, floorBaseY, type BuildingLayout } from './layout';
import type { Room, RoomType } from '../types/school';

export const floorIdFor = (level: number): string => `f${level}`;

type RoomTemplate = {
  slot: number; // 0..5, position index within floor
  name: string;
  type: RoomType;
  capacity: number;
  width?: number; // default 8
};

const FLOOR_1: RoomTemplate[] = [
  { slot: 0, name: 'Class 1A', type: 'classroom', capacity: 30 },
  { slot: 1, name: 'Class 1B', type: 'classroom', capacity: 30 },
  { slot: 2, name: 'Class 2A', type: 'classroom', capacity: 30 },
  { slot: 3, name: 'Class 2B', type: 'classroom', capacity: 30 },
  { slot: 4, name: 'Library', type: 'library', capacity: 40, width: 12 },
  { slot: 5, name: 'Teacher Room', type: 'office', capacity: 8 },
];

const FLOOR_2: RoomTemplate[] = [
  { slot: 0, name: 'Class 5A', type: 'classroom', capacity: 30 },
  { slot: 1, name: 'Class 5B', type: 'classroom', capacity: 30 },
  { slot: 2, name: 'Class 6A', type: 'classroom', capacity: 30 },
  { slot: 3, name: 'Class 6B', type: 'classroom', capacity: 30 },
  { slot: 4, name: 'Laboratory', type: 'laboratory', capacity: 24 },
  { slot: 5, name: 'Computer Lab', type: 'laboratory', capacity: 24 },
];

/** Generic floors 3+: classrooms. */
function genericTemplates(level: number): RoomTemplate[] {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return letters.map((l, i) => ({
    slot: i,
    name: `Class ${level}${l}`,
    type: 'classroom' as RoomType,
    capacity: 30,
  }));
}

/**
 * U placement: slots 0–3 in the rear wing along X (corridor on courtyard side),
 * slot 4 in the left wing, slot 5 in the right wing (corridor strips face courtyard).
 */
function placeU(
  t: RoomTemplate,
  templates: RoomTemplate[],
  layout: BuildingLayout,
): { x: number; z: number; width: number; depth: number; rotationY?: number } {
  const w = layout.wings;
  const ROW_DEPTH = 7;
  if (t.slot < 4) {
    // rear wing: sequential from west wall, 0.5 gaps
    const rear = templates.filter((x) => x.slot < 4);
    let cursor = -w.rearWidth / 2 + 0.5;
    for (const prev of rear) {
      if (prev.slot >= t.slot) break;
      cursor += (prev.width ?? 8) + 0.5;
    }
    const width = t.width ?? 8;
    const rearCz = w.mouthZ - w.sideDepth - w.rearDepth / 2;
    return {
      x: cursor + width / 2,
      z: rearCz - (w.rearDepth / 2 - ROW_DEPTH / 2 - 0.5),
      width,
      depth: ROW_DEPTH,
    };
  }
  // side wings: single room per wing, corridor strips face courtyard.
  // Local +Z (door side) rotates toward the courtyard: left +90°, right −90°.
  const sideCx = w.rearWidth / 2 - w.sideWidth / 2;
  const width = Math.min(t.width ?? 8, w.sideWidth - 4);
  const left = t.slot === 4;
  return {
    x: left ? -sideCx : sideCx,
    z: w.mouthZ - w.sideDepth / 2,
    width,
    depth: ROW_DEPTH,
    rotationY: left ? Math.PI / 2 : -Math.PI / 2,
  };
}

/**
 * Straight placement per row (3 rooms/row, corridor z=0 in the middle).
 * Rooms flow left→right with 0.3 gaps; stairs zone (x>11) stays free.
 */
function placeStraight(
  t: RoomTemplate,
  templates: RoomTemplate[],
  layout: BuildingLayout,
): { x: number; z: number; width: number; depth: number; rotationY?: number } {
  const ROW_DEPTH = 7;
  const ROW_Z = [-4.5, 4.5];
  const row = t.slot < 3 ? 0 : 1;
  const indexInRow = t.slot % 3;
  // Recompute row cursor: sum of preceding widths in this row + gaps
  const rowTemplates = templates.filter((x) => (x.slot < 3 ? 0 : 1) === row);
  let cursor = -layout.width / 2 + 1; // left margin, keeps x>11 free for stairs
  for (const prev of rowTemplates) {
    if (prev.slot % 3 >= indexInRow) break;
    cursor += (prev.width ?? 8) + 0.3;
  }
  const width = t.width ?? 8;
  return { x: cursor + width / 2, z: ROW_Z[row], width, depth: ROW_DEPTH };
}

/**
 * Sequential placement per row (3 rooms/row, corridor z=0 in the middle).
 * Rooms flow left→right from x=-15 with 0.3 gaps; stairs zone (x>11) stays free.
 * Variable widths (e.g. library 12m) are supported — no fixed column grid.
 */
export function generateRooms(layout: BuildingLayout = DEFAULT_LAYOUT): Room[] {
  const rooms: Room[] = [];

  for (let level = 1; level <= layout.floorCount; level++) {
    const templates = level === 1 ? FLOOR_1 : level === 2 ? FLOOR_2 : genericTemplates(level);
    const baseY = floorBaseY(level, layout);

    for (const t of templates) {
      const placed =
        layout.shape === 'U'
          ? placeU(t, templates, layout)
          : placeStraight(t, templates, layout);

      rooms.push({
        id: `A${level}0${t.slot + 1}`,
        floorId: floorIdFor(level),
        name: t.name,
        type: t.type,
        position: [placed.x, baseY, placed.z],
        rotationY: placed.rotationY,
        dimensions: { width: placed.width, height: layout.wallHeight, depth: placed.depth },
        capacity: t.capacity,
      });
    }
  }
  return rooms;
}

export const rooms: Room[] = generateRooms();

export const roomsById: Record<string, Room> = Object.fromEntries(rooms.map((r) => [r.id, r]));

export function roomsByFloor(level: number): Room[] {
  return rooms.filter((r) => r.floorId === floorIdFor(level));
}
