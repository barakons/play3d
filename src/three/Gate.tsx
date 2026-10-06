import { Html } from '@react-three/drei';
import { gatePosts, type CampusLayout } from '../data/layout';

/** Main gate: two pillars, 6m opening, beam with school sign, perimeter walls. */
export default function Gate({ campus }: { campus: CampusLayout }) {
  const posts = gatePosts(campus);
  const { pillarWidth, pillarHeight, z } = campus.gate;
  const beamY = pillarHeight + 0.4;
  const halfW = campus.schoolyard.halfWidth;
  const wallH = 1.6;

  return (
    <group>
      {/* pillars */}
      {posts.map(([x, pz], i) => (
        <mesh key={i} position={[x, pillarHeight / 2, pz]}>
          <boxGeometry args={[pillarWidth, pillarHeight, pillarWidth]} />
          <meshStandardMaterial color="#e8e2d4" />
        </mesh>
      ))}
      {/* beam + sign */}
      <mesh position={[0, beamY, z]}>
        <boxGeometry args={[posts[1][0] - posts[0][0] + pillarWidth * 2, 0.8, 0.6]} />
        <meshStandardMaterial color="#d9d2c0" />
      </mesh>
      <Html center distanceFactor={40} position={[0, beamY + 0.9, z]}>
        <div
          style={{
            background: '#1f2937',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 12px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}
        >
          AL-FALAH SCHOOL
        </div>
      </Html>
      {/* low perimeter walls, gap at gate (x −3..3) */}
      {[
        { x: -(3 + (halfW - 3) / 2), w: halfW - 3 },
        { x: 3 + (halfW - 3) / 2, w: halfW - 3 },
      ].map((s, i) => (
        <mesh key={i} position={[s.x, wallH / 2, z]}>
          <boxGeometry args={[s.w, wallH, 0.3]} />
          <meshStandardMaterial color="#ded8c8" />
        </mesh>
      ))}
    </group>
  );
}
