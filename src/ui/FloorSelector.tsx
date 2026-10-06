import { DEFAULT_LAYOUT, floorCenter } from '../data/layout';
import { useSchoolStore } from '../state/schoolStore';

export default function FloorSelector() {
  const selectedFloor = useSchoolStore((s) => s.selectedFloor);
  const selectFloor = useSchoolStore((s) => s.selectFloor);
  const setFocusTarget = useSchoolStore((s) => s.setFocusTarget);
  const levels = Array.from({ length: DEFAULT_LAYOUT.floorCount }, (_, i) => i + 1).reverse();

  return (
    <div className="mt-1 flex flex-col gap-1">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => {
            selectFloor(level);
            setFocusTarget(floorCenter(level));
          }}
          className={`rounded border px-2 py-1 text-left text-sm ${
            selectedFloor === level
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'hover:bg-slate-100'
          }`}
        >
          Floor {level}
        </button>
      ))}
    </div>
  );
}
