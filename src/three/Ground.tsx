import { DEFAULT_CAMPUS } from '../data/layout';

export default function Ground() {
  const campus = DEFAULT_CAMPUS;
  return (
    <group>
      {/* outer grass */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#86b06a" />
      </mesh>
      {/* campus ground slab */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[campus.halfWidth * 2, campus.halfDepth * 2]} />
        <meshStandardMaterial color="#7fae67" />
      </mesh>
    </group>
  );
}
