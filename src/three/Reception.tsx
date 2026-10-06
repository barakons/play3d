import { Html } from '@react-three/drei';
import type { CampusLayout } from '../data/layout';
import Door from './Door';
import Window from './Window';

/** Small reception/lobby at the front center. Reuses Door + Window. No interior. */
export default function Reception({ campus }: { campus: CampusLayout }) {
  const { x, z, width, depth, height } = campus.reception;
  const frontZ = depth / 2; // local +Z faces the gate

  return (
    <group position={[x, 0, z]}>
      {/* body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#f2f0e9" />
      </mesh>
      {/* roof */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.4, 0.3, depth + 0.4]} />
        <meshStandardMaterial color="#9aa0a8" />
      </mesh>
      {/* glass front */}
      <Window position={[-width / 4, 2.2, frontZ]} />
      <Window position={[width / 4, 2.2, frontZ]} />
      {/* entrance door on gate side */}
      <Door position={[0, 1.1, frontZ]} />
      {/* sign */}
      <Html center distanceFactor={30} position={[0, height + 1, 0]}>
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '2px 10px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}
        >
          RECEPTION
        </div>
      </Html>
    </group>
  );
}
