import { useMemo, useState } from 'react';
import { rooms } from '../data/rooms';
import { useSchoolStore } from '../state/schoolStore';
import { levelFromFloorId } from '../three/useFloorOpacity';
import type { Room } from '../types/school';

function matches(room: Room, q: string): boolean {
  const hay = `${room.id} ${room.name} ${room.type}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => hay.includes(part));
}

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selectRoom = useSchoolStore((s) => s.selectRoom);
  const selectFloor = useSchoolStore((s) => s.selectFloor);
  const setFocusTarget = useSchoolStore((s) => s.setFocusTarget);

  const results = useMemo(
    () => (query.trim() ? rooms.filter((r) => matches(r, query)).slice(0, 8) : []),
    [query],
  );

  const choose = (room: Room) => {
    selectRoom(room.id);
    selectFloor(levelFromFloorId(room.floorId));
    const [x, y, z] = room.position;
    setFocusTarget([x, y + 1.5, z]);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results.length > 0) choose(results[0]);
          if (e.key === 'Escape') {
            setQuery('');
            setOpen(false);
          }
        }}
        placeholder="🔍 Search room..."
        className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-slate-500"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded border border-slate-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => choose(r)}
                className="block w-full px-2 py-1.5 text-left text-sm hover:bg-slate-100"
              >
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-slate-500">
                  Building A / Floor {levelFromFloorId(r.floorId)} / {r.id}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
