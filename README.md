# 3D School Visualization — V1

Interactive 3D visualization of Al-Falah School (Building A, 2 floors, 12 rooms).
React + TypeScript + Vite + React Three Fiber + Drei + Zustand + Tailwind.

## Run

```bash
npm install
npm run dev
```

Open the printed localhost URL (default http://localhost:5173).

## Use

- Left-drag orbit, right-drag pan, wheel zoom
- Floor buttons switch floors (inactive floor dims)
- Click a room to select + see info; double-click to fly to it
- Search matches room id / name / type (e.g. `5A`, `library`, `A201`)
- X-Ray Mode makes upper floors transparent; Room Labels toggles 3D labels
- Reset View returns to the default overview

## Configure

One file drives geometry: `src/data/layout.ts` (`DEFAULT_LAYOUT`).
Set `floorCount` (e.g. 4) or `shape: 'straight' | 'U'` — floors, rooms,
stairs, and camera targets regenerate. Details in `docs/`.
