export default function Door({
  position,
  opacity = 1,
}: {
  position: [number, number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.1, 2.2, 0.08]} />
      <meshStandardMaterial color="#8b5e34" transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}
