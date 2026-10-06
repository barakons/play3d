import { pathRect, type CampusLayout } from '../data/layout';

/** Pedestrian path from the gate opening to the reception door (x=0 axis). */
export default function EntrancePath({ campus }: { campus: CampusLayout }) {
  const path = pathRect(campus);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[path.x, 0.03, path.z]} receiveShadow>
      <planeGeometry args={[path.width, path.depth]} />
      <meshStandardMaterial color="#d8d2c4" />
    </mesh>
  );
}
