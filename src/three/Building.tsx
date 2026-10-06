import { DEFAULT_LAYOUT, floorBaseY, footprintSegments } from '../data/layout';
import type { Floor as FloorData } from '../types/school';
import Classroom from './Classroom';
import Floor from './Floor';
import Stairs from './Stairs';

export default function Building({ floors }: { floors: FloorData[] }) {
  const layout = DEFAULT_LAYOUT;
  const topLevel = floors.length;
  const roofY = floorBaseY(topLevel, layout) + layout.wallHeight + 0.15;
  const segments = footprintSegments(layout.shape, layout);

  return (
    <group>
      {floors.map((f) => (
        <Floor key={f.id} level={f.level} />
      ))}
      {/* rooms at absolute positions (room.position includes floor base Y) */}
      {floors.flatMap((f) =>
        f.rooms.map((r) => <Classroom key={r.id} room={r} />),
      )}
      {/* one stair flight per adjacent floor pair */}
      {floors.slice(0, -1).map((f) => (
        <Stairs key={f.id} fromFloor={f.level} toFloor={f.level + 1} />
      ))}
      {/* flat roof over top floor */}
      {segments.map((s, i) => (
        <mesh key={i} position={[s.x, roofY, s.z]}>
          <boxGeometry args={[s.width + 0.4, 0.3, s.depth + 0.4]} />
          <meshStandardMaterial color="#9aa0a8" />
        </mesh>
      ))}
    </group>
  );
}
