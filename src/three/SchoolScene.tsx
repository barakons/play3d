import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useSchoolStore } from '../state/schoolStore';
import { DEFAULT_CAMPUS } from '../data/layout';
import type { Floor as FloorData } from '../types/school';
import Building from './Building';
import CameraRig from './CameraRig';
import EntrancePath from './EntrancePath';
import Gate from './Gate';
import Ground from './Ground';
import Road from './Road';
import Reception from './Reception';
import Schoolyard from './Schoolyard';

export default function SchoolScene({ floors }: { floors: FloorData[] }) {
  const clearSelection = useSchoolStore((s) => s.clearSelection);
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [20, 18, 20], fov: 50 }}
      onPointerMissed={() => clearSelection()}
    >
      <color attach="background" args={['#e8eef4']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 20, 10]} intensity={1.2} />
      <Ground />
      <Schoolyard campus={DEFAULT_CAMPUS} />
      <Road campus={DEFAULT_CAMPUS} />
      <Gate campus={DEFAULT_CAMPUS} />
      <EntrancePath campus={DEFAULT_CAMPUS} />
      <Reception campus={DEFAULT_CAMPUS} />
      <Building floors={floors} />
      <CameraRig />
      <OrbitControls makeDefault enablePan enableZoom />
    </Canvas>
  );
}
