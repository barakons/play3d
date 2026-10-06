import type { Room } from '../types/school';
import { useSchoolStore } from '../state/schoolStore';
import Door from './Door';
import Furniture, { type FurnitureKind } from './Furniture';
import RoomLabel from './RoomLabel';
import { levelFromFloorId, useFloorOpacity } from './useFloorOpacity';
import Window from './Window';

const WALL_BY_TYPE: Record<string, string> = {
  classroom: '#f7f5ef',
  laboratory: '#eef4ff',
  library: '#fff6e6',
  office: '#eef7ee',
  toilet: '#eef2f3',
  hall: '#f3efe6',
};

const FURNITURE_BY_TYPE: Record<string, FurnitureKind> = {
  classroom: 'classroom',
  laboratory: 'lab',
  library: 'library',
  office: 'office',
  toilet: 'classroom',
  hall: 'classroom',
};

const THICK = 0.15;
const DOOR_GAP = 1.2;

export default function Classroom({ room }: { room: Room }) {
  const selectRoom = useSchoolStore((s) => s.selectRoom);
  const setFocusTarget = useSchoolStore((s) => s.setFocusTarget);
  const selected = useSchoolStore((s) => s.selectedRoomId === room.id);
  const opacity = useFloorOpacity(levelFromFloorId(room.floorId));
  const transparent = opacity < 1;
  const highlight = selected ? { emissive: '#ff8c00', emissiveIntensity: 0.45 } : {};
  const { width, height, depth } = room.dimensions;
  const wall = WALL_BY_TYPE[room.type] ?? '#f7f5ef';
  // corridor (z=0) side in local coords: rooms sit at z=±4.5
  const corridorSide = room.position[2] > 0 ? -1 : 1;
  const frontZ = (corridorSide * depth) / 2;
  const backZ = (-corridorSide * depth) / 2;
  const segW = (width - DOOR_GAP) / 2;

  return (
    <group
      position={room.position}
      rotation-y={room.rotationY ?? 0}
      onClick={(e) => {
        e.stopPropagation();
        selectRoom(room.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        selectRoom(room.id);
        const [x, y, z] = room.position;
        setFocusTarget([x, y + 1.5, z]);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* floor */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#e3ded2" transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      {/* side walls */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[THICK, height, depth]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[THICK, height, depth]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      {/* corridor-side wall with door gap */}
      <mesh position={[-(DOOR_GAP / 2 + segW / 2), height / 2, frontZ]}>
        <boxGeometry args={[segW, height, THICK]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      <mesh position={[DOOR_GAP / 2 + segW / 2, height / 2, frontZ]}>
        <boxGeometry args={[segW, height, THICK]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      <mesh position={[0, height + 0.2, frontZ]}>
        <boxGeometry args={[DOOR_GAP, 0.9, THICK]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      <Door position={[0, 1.1, frontZ]} opacity={opacity} />
      {/* outer wall + windows */}
      <mesh position={[0, height / 2, backZ]}>
        <boxGeometry args={[width, height, THICK]} />
        <meshStandardMaterial color={wall} transparent={transparent} opacity={opacity} {...highlight} />
      </mesh>
      {[-width / 4, 0, width / 4].map((x) => (
        <Window key={x} position={[x, 1.9, backZ]} opacity={opacity} />
      ))}
      <Furniture
        kind={FURNITURE_BY_TYPE[room.type] ?? 'classroom'}
        width={width}
        depth={depth}
        opacity={opacity}
      />
      <RoomLabel room={room} />
    </group>
  );
}
