export type BuildingShape = 'straight' | 'U';

export type BuildingLayout = {
  floorCount: number;
  floorHeight: number;
  shape: BuildingShape;
  width: number;
  depth: number;
  wallHeight: number;
  /** U-wing dimensions (updated-req §12). mouthZ = open side, faces +Z. */
  wings: {
    rearWidth: number;
    rearDepth: number;
    sideWidth: number;
    sideDepth: number;
    mouthZ: number;
  };
};

export const DEFAULT_LAYOUT: BuildingLayout = {
  floorCount: 2,
  floorHeight: 4,
  shape: 'U',
  width: 50,
  depth: 16,
  wallHeight: 3.5,
  wings: {
    rearWidth: 50,
    rearDepth: 12,
    sideWidth: 12,
    sideDepth: 35,
    mouthZ: 11.5,
  },
};

export const DEFAULT_CAM_POS: [number, number, number] = [20, 18, 20];
export const DEFAULT_CAM_TARGET: [number, number, number] = [0, 2, 0];

/* ------------------------------------------------------------------ */
/* Campus (V2): front/entrance = +Z. x −40..40, z −50..50.             */
/* ------------------------------------------------------------------ */

export type CampusLayout = {
  /** half-extents of the campus grass */
  halfWidth: number;
  halfDepth: number;
  /** grey schoolyard slab: building, frontyard, gate and path sit on it */
  schoolyard: { halfWidth: number; backZ: number; frontZ: number };
  road: { z: number; width: number; length: number };
  sidewalkWidth: number;
  gate: { z: number; opening: number; pillarWidth: number; pillarHeight: number };
  path: { width: number; fromZ: number; toZ: number };
  reception: { x: number; z: number; width: number; depth: number; height: number };
  buildingCenterZ: number;
};

export const DEFAULT_CAMPUS: CampusLayout = {
  halfWidth: 40,
  halfDepth: 50,
  schoolyard: { halfWidth: 35, backZ: -45, frontZ: 30 },
  road: { z: 39, width: 12, length: 100 },
  sidewalkWidth: 2,
  gate: { z: 30, opening: 6, pillarWidth: 1, pillarHeight: 4 },
  path: { width: 6, fromZ: 30, toZ: 22 },
  reception: { x: 0, z: 18, width: 12, depth: 8, height: 4 },
  buildingCenterZ: -15,
};

/** Grey schoolyard slab rect. */
export function schoolyardRect(campus: CampusLayout = DEFAULT_CAMPUS) {
  const { halfWidth, backZ, frontZ } = campus.schoolyard;
  return { x: 0, z: (backZ + frontZ) / 2, width: halfWidth * 2, depth: frontZ - backZ };
}

/** Frontyard lawns flanking the entrance path, inside the schoolyard. */
export function frontyardRects(campus: CampusLayout = DEFAULT_CAMPUS) {
  const pathHalf = campus.path.width / 2 + 0.5;
  const lawnHalf = 16;
  const z0 = campus.reception.z - campus.reception.depth / 2 - 1;
  const z1 = campus.schoolyard.frontZ - 1;
  return [-1, 1].map((side) => ({
    x: side * (pathHalf + lawnHalf / 2),
    z: (z0 + z1) / 2,
    width: lawnHalf,
    depth: z1 - z0,
  }));
}

/** Road surface rect (x centered at 0). */
export function roadRect(campus: CampusLayout = DEFAULT_CAMPUS) {
  return { x: 0, z: campus.road.z, width: campus.road.length, depth: campus.road.width };
}

/** Sidewalk strips flanking the road. */
export function sidewalkRects(campus: CampusLayout = DEFAULT_CAMPUS) {
  const { z, width, length } = campus.road;
  const s = campus.sidewalkWidth;
  return [
    { x: 0, z: z - width / 2 - s / 2, width: length, depth: s },
    { x: 0, z: z + width / 2 + s / 2, width: length, depth: s },
  ];
}

/** Gate pillar centers: opening stays clear between them. */
export function gatePosts(campus: CampusLayout = DEFAULT_CAMPUS): [number, number][] {
  const x = campus.gate.opening / 2 + campus.gate.pillarWidth / 2;
  return [
    [-x, campus.gate.z],
    [x, campus.gate.z],
  ];
}

/** Entrance path rect from gate toward reception. */
export function pathRect(campus: CampusLayout = DEFAULT_CAMPUS) {
  const { width, fromZ, toZ } = campus.path;
  return { x: 0, z: (fromZ + toZ) / 2, width, depth: Math.abs(fromZ - toZ) };
}

/** Y base of a floor slab (1-indexed level). */
export function floorBaseY(level: number, layout: BuildingLayout = DEFAULT_LAYOUT): number {
  return (level - 1) * layout.floorHeight;
}

/** Camera focus point for a floor. */
export function floorCenter(level: number, layout: BuildingLayout = DEFAULT_LAYOUT): [number, number, number] {
  return [0, floorBaseY(level, layout) + 2, 0];
}

/** Stairs anchor: east end for straight, courtyard for U. */
export function stairsPosition(shape: BuildingShape = DEFAULT_LAYOUT.shape): [number, number, number] {
  return shape === 'U' ? [0, 0, -6] : [15, 0, 0];
}

export type FootprintRect = {
  x: number;
  z: number;
  width: number;
  depth: number;
};

/**
 * Wall/slab segments per shape.
 * straight = single rect; U = rear wing + two side wings, courtyard open toward +Z.
 * Frame is shared with rooms/stairs (rear spans mouthZ−47..mouthZ−35).
 */
export function footprintSegments(
  shape: BuildingShape = DEFAULT_LAYOUT.shape,
  layout: BuildingLayout = DEFAULT_LAYOUT,
): FootprintRect[] {
  if (shape === 'U') {
    const w = layout.wings;
    const rearCz = w.mouthZ - w.sideDepth - w.rearDepth / 2;
    const sideCz = w.mouthZ - w.sideDepth / 2;
    const sideCx = w.rearWidth / 2 - w.sideWidth / 2;
    return [
      { x: 0, z: rearCz, width: w.rearWidth, depth: w.rearDepth },
      { x: -sideCx, z: sideCz, width: w.sideWidth, depth: w.sideDepth },
      { x: sideCx, z: sideCz, width: w.sideWidth, depth: w.sideDepth },
    ];
  }
  return [{ x: 0, z: 0, width: layout.width, depth: layout.depth }];
}

/** Open courtyard rect for shape U (null for straight). */
export function courtyardRect(layout: BuildingLayout = DEFAULT_LAYOUT) {
  const w = layout.wings;
  const innerHalf = w.rearWidth / 2 - w.sideWidth;
  return {
    x: 0,
    z: (w.mouthZ - w.sideDepth + w.mouthZ) / 2,
    width: innerHalf * 2,
    depth: w.sideDepth,
  };
}
