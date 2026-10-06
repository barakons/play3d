import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSchoolStore } from '../state/schoolStore';

const OFFSET = new THREE.Vector3(10, 8, 10);

/** Smoothly flies camera + orbit target toward focusTarget, then releases control. */
export default function CameraRig() {
  const focusTarget = useSchoolStore((s) => s.focusTarget);
  const camera = useThree((s) => s.camera);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controls = useThree((s) => s.controls) as any;

  useFrame((_, delta) => {
    if (!focusTarget || !controls) return;
    const target = new THREE.Vector3(...focusTarget);
    const desired = target.clone().add(OFFSET);
    const speed = Math.min(1, delta * 3);

    controls.target.lerp(target, speed);
    camera.position.lerp(desired, speed);
    controls.update();

    if (camera.position.distanceTo(desired) < 0.05 && controls.target.distanceTo(target) < 0.05) {
      useSchoolStore.getState().setFocusTarget(null);
    }
  });

  return null;
}
