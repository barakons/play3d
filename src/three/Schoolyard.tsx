import { frontyardRects, schoolyardRect, type CampusLayout } from '../data/layout';

/** Grey schoolyard slab with frontyard lawns. Building, gate, path and reception sit on it. */
export default function Schoolyard({ campus }: { campus: CampusLayout }) {
  const yard = schoolyardRect(campus);
  return (
    <group>
      {/* grey pavement */}
      <mesh rotation-x={-Math.PI / 2} position={[yard.x, 0.015, yard.z]} receiveShadow>
        <planeGeometry args={[yard.width, yard.depth]} />
        <meshStandardMaterial color="#b5b8bc" />
      </mesh>
      {/* frontyard lawns flanking the entrance path */}
      {frontyardRects(campus).map((lawn, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[lawn.x, 0.025, lawn.z]} receiveShadow>
          <planeGeometry args={[lawn.width, lawn.depth]} />
          <meshStandardMaterial color="#82b368" />
        </mesh>
      ))}
    </group>
  );
}
