import { DEFAULT_LAYOUT, stairsPosition } from '../data/layout';

const STEPS = 12;
const WIDTH = 2.5;
const RUN = 0.9;

/** Single procedural flight connecting two adjacent floors. */
export default function Stairs({ fromFloor, toFloor }: { fromFloor: number; toFloor: number }) {
  const layout = DEFAULT_LAYOUT;
  const [sx, , sz] = stairsPosition(layout.shape);
  const fromY = (fromFloor - 1) * layout.floorHeight;
  const span = Math.max(1, toFloor - fromFloor);
  const totalSteps = STEPS * span;
  const rise = layout.floorHeight / STEPS;

  return (
    <group position={[sx, fromY, sz]}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <mesh key={i} position={[0, (i + 0.5) * rise, (i - totalSteps / 2) * RUN]}>
          <boxGeometry args={[WIDTH, rise, RUN + 0.05]} />
          <meshStandardMaterial color="#b9bec7" />
        </mesh>
      ))}
      {/* rails */}
      {[-WIDTH / 2, WIDTH / 2].map((x) => (
        <mesh key={x} position={[x, (span * layout.floorHeight) / 2 + 0.5, 0]}>
          <boxGeometry args={[0.08, 0.08, totalSteps * RUN]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}
    </group>
  );
}
