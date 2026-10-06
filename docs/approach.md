# Approach — 3D School Visualization V1

Source: `docs/req.md` V1.0

## 1. Mental model

> "I am building a normal React application, and one component happens to be a 3D viewport."

Don't learn all of Three.js. Need ~10 concepts: Scene, Box/Plane, Mesh + Material, Group/Position, Ambient + Directional light, PerspectiveCamera, OrbitControls, Raycast onClick, Html labels, camera lerp.

## 2. Goal / Done

Done = user can open site, see 3D school, orbit, switch Floor 1/2, click Class 5A → see info, search "library" → camera flies there. That's it. No ERP, auth, backend, GLB, VR.

## 3. Stack (fixed per req)

React + TS + Vite + React Three Fiber + Drei + Three + Zustand + Tailwind. No backend. Static `data/*.ts`.

1 unit = 1 meter. Classroom 8 x 3.5 x 7m. Primitives only.

## 4. Architecture separation (critical)

```
data/  -> what rooms exist, where, what type (school.ts, buildings.ts, floors.ts, rooms.ts)
state/ -> what is selected (schoolStore.ts: selectedRoomId, selectedFloor, xrayMode, showRoomLabels)
three/ -> how it looks (SchoolScene, Ground, Building, Floor, Classroom, Stairs, Door, Window, Furniture, RoomLabel)
ui/    -> how user interacts (Header, Sidebar, FloorSelector, SearchBox, RoomPanel, ControlsHelp)
```

Rule: 3D components take `room` prop, never import business logic. UI writes to Zustand, 3D reads from Zustand.

## 5. Data first

Define types `School > Building > Floor > Room` (§7) before 3D. One school: Al-Falah, Building A, Floor1 A101-A106, Floor2 A201-A206. Each Room: id, floorId, name, type, position[x,y,z], dimensions, capacity.

Layout: rooms in two rows along X, corridor in middle, stairs at one end connecting Y=0 → Y=~4m.

## 6. Build order (7 runnable milestones)

1. **Prove R3F:** ground + 2 floor boxes + lights + OrbitControls + header/sidebar shell
2. **Shell:** Ground + Building + Floor components
3. **Spatial:** 12x Classroom + procedural Stairs + Door/Window/Furniture
4. **Navigate:** FloorSelector (dim/hide inactive, move camera)
5. **Select:** click → highlight + RoomPanel + optional fly-to
6. **Search:** SearchBox (id/name/type) → select + highlight + camera fly + Reset View
7. **Polish:** X-Ray (upper floor transparent), Labels toggle, help

Each milestone must run with `npm install && npm run dev`. Never build all at once.

## 7. Hard parts + solutions

* **Camera focus:** store `focusTarget: [x,y,z] | null` in Zustand. `CameraRig` component lerps controls.target + camera position in `useFrame`. Reset clears it.
* **Floor switching:** `selectedFloor` drives opacity/visible in `Floor.tsx`. Keep stairs always visible.
* **X-Ray:** if `xrayMode && floor.level > selectedFloor` → `transparent opacity 0.15 depthWrite false`. Simple material swap, no shaders.
* **Labels:** Drei `<Html>` only if `showRoomLabels`, hide beyond distance.
* **Perf:** ~12 rooms, ~100 furniture boxes = trivial. No instancing in V1, but keep `Furniture.tsx` reusable for later.

## 8. Verification

Map to AC-01..AC-15 in `task.md`. Manual check per milestone + final full pass of Definition of Done (§34).
