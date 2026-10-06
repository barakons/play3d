export default function Window({
  position,
  opacity = 1,
}: {
  position: [number, number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.8, 1.2, 0.06]} />
      <meshStandardMaterial
        color="#bfe3ff"
        emissive="#9fc8e8"
        emissiveIntensity={0.35}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
