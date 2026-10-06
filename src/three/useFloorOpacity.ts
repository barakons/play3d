import { useSchoolStore } from '../state/schoolStore';

/**
 * Shared dim rule: inactive floors fade, X-ray floors above selection go ghost.
 * Stairs never use this (always fully visible).
 */
export function useFloorOpacity(level: number): number {
  const selectedFloor = useSchoolStore((s) => s.selectedFloor);
  const xrayMode = useSchoolStore((s) => s.xrayMode);
  if (xrayMode && level > selectedFloor) return 0.15;
  if (level !== selectedFloor) return 0.25;
  return 1;
}

export function levelFromFloorId(floorId: string): number {
  return parseInt(floorId.replace('f', ''), 10);
}
