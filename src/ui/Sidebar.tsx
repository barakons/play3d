import { roomsById } from '../data/rooms';
import { useSchoolStore } from '../state/schoolStore';
import ControlsHelp from './ControlsHelp';
import FloorSelector from './FloorSelector';
import SearchBox from './SearchBox';

export default function Sidebar() {
  const resetView = useSchoolStore((s) => s.resetView);
  const selectedRoomId = useSchoolStore((s) => s.selectedRoomId);
  const clearSelection = useSchoolStore((s) => s.clearSelection);
  const selectedRoom = selectedRoomId ? roomsById[selectedRoomId] : undefined;
  const xrayMode = useSchoolStore((s) => s.xrayMode);
  const setXrayMode = useSchoolStore((s) => s.setXrayMode);
  const showRoomLabels = useSchoolStore((s) => s.showRoomLabels);
  const setShowRoomLabels = useSchoolStore((s) => s.setShowRoomLabels);

  return (
    <aside className="flex w-64 flex-col gap-4 border-r border-slate-200 bg-white p-4">
      <section>
        <h2 className="text-xs font-semibold uppercase text-slate-500">School</h2>
        <p className="text-sm">Al-Falah School</p>
      </section>
      <section>
        <h2 className="text-xs font-semibold uppercase text-slate-500">Navigation</h2>
        <FloorSelector />
        <button
          onClick={resetView}
          className="mt-2 w-full rounded border px-2 py-1 text-left text-sm hover:bg-slate-100"
        >
          Reset View
        </button>
      </section>
      <section>
        <h2 className="text-xs font-semibold uppercase text-slate-500">Search</h2>
        <div className="mt-1">
          <SearchBox />
        </div>
      </section>
      <section>
        <h2 className="text-xs font-semibold uppercase text-slate-500">Display</h2>
        <label className="mt-1 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={xrayMode}
            onChange={(e) => setXrayMode(e.target.checked)}
          />{' '}
          X-Ray Mode
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showRoomLabels}
            onChange={(e) => setShowRoomLabels(e.target.checked)}
          />{' '}
          Room Labels
        </label>
      </section>
      <ControlsHelp />
      {selectedRoom && (
        <section>
          <h2 className="text-xs font-semibold uppercase text-slate-500">Selected</h2>
          <div className="mt-1 flex items-center justify-between rounded border border-orange-300 bg-orange-50 px-2 py-1 text-sm">
            <span>
              {selectedRoom.name} <span className="text-slate-500">({selectedRoom.id})</span>
            </span>
            <button
              onClick={clearSelection}
              className="rounded px-1 text-slate-400 hover:bg-orange-100 hover:text-slate-700"
              aria-label="Clear selection"
            >
              ✕
            </button>
          </div>
        </section>
      )}
    </aside>
  );
}
