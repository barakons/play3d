import { roomsById } from '../data/rooms';
import { useSchoolStore } from '../state/schoolStore';
import { levelFromFloorId } from '../three/useFloorOpacity';

export default function RoomPanel() {
  const selectedRoomId = useSchoolStore((s) => s.selectedRoomId);
  const clearSelection = useSchoolStore((s) => s.clearSelection);
  const room = selectedRoomId ? roomsById[selectedRoomId] : undefined;

  if (!room) return null;

  return (
    <div className="absolute right-4 top-4 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-semibold">{room.name.toUpperCase()}</h2>
        <button
          onClick={clearSelection}
          className="rounded px-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Building</dt>
          <dd>A</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Floor</dt>
          <dd>{levelFromFloorId(room.floorId)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Room</dt>
          <dd>{room.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Capacity</dt>
          <dd>{room.capacity ?? '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Type</dt>
          <dd className="capitalize">{room.type}</dd>
        </div>
      </dl>
    </div>
  );
}
