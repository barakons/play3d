import { Html } from '@react-three/drei';
import type { Room } from '../types/school';
import { useSchoolStore } from '../state/schoolStore';

export default function RoomLabel({ room }: { room: Room }) {
  const show = useSchoolStore((s) => s.showRoomLabels);
  if (!show) return null;

  return (
    <Html center distanceFactor={20} position={[0, room.dimensions.height + 0.7, 0]}>
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          padding: '2px 8px',
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {room.name}
        <div style={{ fontSize: 10, fontWeight: 400, color: '#64748b' }}>{room.id}</div>
      </div>
    </Html>
  );
}
