import { DEFAULT_LAYOUT, floorBaseY, footprintSegments } from '../data/layout';
import { useFloorOpacity } from './useFloorOpacity';

const WALL = '#f2f0e9';
const SLAB = '#c9ccd1';
const THICK = 0.2;

export default function Floor({ level }: { level: number }) {
  const layout = DEFAULT_LAYOUT;
  const y = floorBaseY(level, layout);
  const opacity = useFloorOpacity(level);
  const transparent = opacity < 1;
  const segments = footprintSegments(layout.shape, layout);

  return (
    <group position={[0, y, 0]}>
      {segments.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]}>
          {/* slab */}
          <mesh receiveShadow>
            <boxGeometry args={[s.width, 0.3, s.depth]} />
            <meshStandardMaterial color={SLAB} transparent={transparent} opacity={opacity} />
          </mesh>
          {/* perimeter walls */}
          <mesh position={[0, layout.wallHeight / 2, -s.depth / 2]}>
            <boxGeometry args={[s.width, layout.wallHeight, THICK]} />
            <meshStandardMaterial color={WALL} transparent={transparent} opacity={opacity} />
          </mesh>
          <mesh position={[0, layout.wallHeight / 2, s.depth / 2]}>
            <boxGeometry args={[s.width, layout.wallHeight, THICK]} />
            <meshStandardMaterial color={WALL} transparent={transparent} opacity={opacity} />
          </mesh>
          <mesh position={[-s.width / 2, layout.wallHeight / 2, 0]}>
            <boxGeometry args={[THICK, layout.wallHeight, s.depth]} />
            <meshStandardMaterial color={WALL} transparent={transparent} opacity={opacity} />
          </mesh>
          <mesh position={[s.width / 2, layout.wallHeight / 2, 0]}>
            <boxGeometry args={[THICK, layout.wallHeight, s.depth]} />
            <meshStandardMaterial color={WALL} transparent={transparent} opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
