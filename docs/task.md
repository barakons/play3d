# Task Breakdown — 3D School Visualization V1 (Detailed)

Source: `docs/req.md`, `docs/approach.md`, `docs/updated-req.md` (V2 campus)
Rule: `npm install && npm run dev` must work after every M.
Status: `[ ] todo / [x] done`. Update as you go.

## Progress (updated 2026-10-06, V1 COMPLETE; V2 M8 done, M9–M14 todo)

- [x] M1 — Prove R3F works (T1.1–T1.8 all done, `npm run build` + `npm run dev` verified)
- [x] M2 — Data + state shell + layout config (T2.0–T2.6 all done, generator + store + layout checks passed)
- [x] M3 — Spatial model (T3.1–T3.8 all done, footprint/stairs checks passed)
- [x] M4 — Floor navigation (T4.1–T4.4 all done, build+dev verified)
- [x] M5 — Selection (T5.1–T5.4 all done, build verified)
- [x] M6 — Search + focus (T6.1–T6.4 all done, search checks + build passed)
- [x] M7 — Polish + final gate (T7.1–T7.4 all done, fresh install + AC-01..AC-15 passed)
- [x] M8 — Campus ground: road + sidewalk (T8.1–T8.3 done, build+dev verified)
- [x] M9 — Gate: pillars + opening + sign (T9.1–T9.2 done, build+dev verified)
- [x] M10 — Reception + entrance path (T10.1–T10.3 done, build+dev verified)
- [x] M11 — U-shaped building (T11.1–T11.3 done, wing/room/stairs checks + build passed)
- [ ] M12 — Building details: windows/doors/stairs reuse (Stage 5)
- [ ] M13 — Courtyard + landscaping (Stage 6)
- [ ] M14 — Campus polish + final gate (Stage 7)

Detail per task: all M1–M7 items marked [x]. V1 complete.

Conventions for all tasks:
- 1 unit = 1 meter. Classroom 8 x 3.5 x 7m.
- 3D takes `room` prop, never imports business rules. UI writes Zustand, 3D reads Zustand.
- Primitives only: Box, Plane. No GLB, no backend, no textures.
- V2 orientation (fixed): front/entrance = **+Z**. Grey schoolyard slab x −35..35, z −45..+30;
  gate on its boundary z=+30; road outside at z≈+39; reception z≈+18;
  U-building rear wing at z≈-20, courtyard opens toward +Z. Do NOT mirror or rotate this.
- V2 positions live in `src/data/layout.ts` (`CAMPUS` config) — no literals in `three/`.

---

## [x] M1 — Prove R3F works → AC-01, AC-02 (DONE)

### [x] T1.1 Scaffold Vite React-TS
- **Files:** `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`
- **Steps:** `npm create vite@latest . -- --template react-ts` (keep `docs/`), `npm install`
- **Done:** `npm run dev` shows Vite starter.

### [x] T1.2 Install 3D + state + style deps
- **Files:** `package.json`
- **Steps:** `npm i three @react-three/fiber @react-three/drei zustand`, `npm i -D @types/three`, setup Tailwind per Vite docs, add `src/index.css` import in `main.tsx`
- **Done:** `npm run build` passes with no type errors.

### [x] T1.3 App fullscreen layout shell
- **Files:** `src/app/App.tsx`
- **Steps:** flex column: top Header (48px), row below: Sidebar 260px + viewport div flex-1. Viewport div holds Canvas. `h-screen w-screen overflow-hidden`.
- **Done:** layout renders without Canvas content.

### [x] T1.4 SchoolScene Canvas + lights + controls
- **Files:** `src/three/SchoolScene.tsx`
- **Steps:** `<Canvas shadows camera={{position:[20,18,20], fov:50}}>`, `<ambientLight intensity={0.6}/>`, `<directionalLight position={[15,20,10]} intensity={1.2}/>`, `<OrbitControls makeDefault enablePan enableZoom />`, `<Ground/>`, `<Building/>`, `<color attach="background" args={['#e8eef4']}/>`
- **Done:** empty scene renders, orbit (left-drag) / pan (right-drag) / zoom (wheel) works.

### [x] T1.5 Ground plane
- **Files:** `src/three/Ground.tsx`
- **Steps:** `<mesh rotation-x={-Math.PI/2} receiveShadow>` + `<planeGeometry args={[100,100]}/>` + `<meshStandardMaterial color="#86b06a"/>`
- **Done:** green plane visible under building.

### [x] T1.6 Building + Floor placeholder boxes
- **Files:** `src/three/Building.tsx`, `src/three/Floor.tsx`
- **Steps:** Building = group at origin. Floor1 box `[30,0.3,14]` at y=0, Floor2 same at y=4. Walls: 4 thin boxes per floor height 3.5. Colors: walls `#f2f0e9`, slab `#c9ccd1`. Props: `Floor({level}:{level:number})`.
- **Done:** two stacked slabs visible from orbit.

### [x] T1.7 Header + Sidebar static
- **Files:** `src/ui/Header.tsx`, `src/ui/Sidebar.tsx`
- **Steps:** Header: "🏫 Al-Falah School". Sidebar sections: SCHOOL name, NAVIGATION Floor 1/2 buttons (no logic yet), DISPLAY checkboxes disabled.
- **Done:** UI matches §4 ASCII sketch.

### [x] T1.8 M1 verify
- **Steps:** `npm install && npm run dev`, check AC-01, AC-02, AC-06 partial (orbit/pan/zoom)
- **Done:** screenshot building from 3 angles.

**Do not in M1:** rooms, stairs, store, search, labels.

---

## [x] M2 — Data + state shell → AC-03, AC-15 partial (DONE)

### [x] T2.0 Building layout config (floorCount + shape)
- **Files:** `src/data/layout.ts` (new, no other file may hardcode sizes)
- **Steps:** define `BuildingShape = 'straight' | 'U'`, `BuildingLayout = { floorCount, floorHeight, shape, width, depth, wallHeight }`, default `{ floorCount: 2, floorHeight: 4, shape: 'straight', width: 36, depth: 16, wallHeight: 3.5 }`. Export helpers: `floorBaseY(level)`, `floorCenter(level)`, `stairsPosition(shape)`, `footprintSegments(shape)` (straight = 1 rect; U = 3 wing rects A/B/C + corridor polyline). V1 renders `straight`; `U` reuses same helpers (walls/rooms attach to wings).
- **Done:** changing `floorCount: 2 → 4` or `shape: 'straight' → 'U'` in one file reconfigures floors/rooms/stairs/camera with no 3D code edits.

### [x] T2.1 Types
- **Files:** `src/types/school.ts`
- **Steps:** copy exact §7 types: `School{id,name,buildings}`, `Building{id,name,floors}`, `Floor{id,buildingId,level,name,rooms}`, `Room{id,floorId,name,type,position,dimensions,capacity?}`. Type `RoomType = classroom|laboratory|library|office|toilet|hall`.
- **Done:** `tsc --noEmit` passes.

### [x] T2.2 Room dataset via generator (no hardcoded positions)
- **Files:** `src/data/rooms.ts`
- **Steps:** implement `generateRooms(layout: BuildingLayout): Room[]` — room grid derived from `layout.width/depth/shape`, corridor 2m middle (z=0), north row z=-4.5 / south row z=+4.5, stairs zone reserved at `stairsPosition(shape)`. Default 2-floor output = 12 rooms: F1 A101 Class 1A, A102 1B, A103 2A, A104 2B, A105 Library (double-wide), A106 Teacher Room (office); F2 A201 5A, A202 5B, A203 6A, A204 6B, A205 Laboratory, A206 Computer Lab. Naming pattern `A{level}0{n}` extends to N floors automatically. Capacities: classrooms 30, lab 24, library 40, office 8.
- **Done:** exported `rooms: Room[]`, `roomsById`, `roomsByFloor(level)` work for any `floorCount`; no position literals outside generator.

### [x] T2.3 School/Building/Floor data
- **Files:** `src/data/school.ts`, `buildings.ts`, `floors.ts`
- **Steps:** `school = {id:'al-falah', name:'Al-Falah School'}`, `building = {id:'A', name:'Building A'}`, floors generated from layout: `Array.from({length: layout.floorCount}, (_,i) => ({id: 'f'+(i+1), level: i+1}))` linking rooms by `floorId`.
- **Done:** `getSchool()` returns full tree for any `floorCount`.

### [x] T2.4 Zustand store
- **Files:** `src/state/schoolStore.ts`
- **Steps:** state per §23 + `focusTarget: [number,number,number] | null`, `setFocusTarget`, `clearSelection`, `resetView` (selectedRoomId=null, focusTarget=DEFAULT_CAM_TARGET). Initial: `selectedFloor:1, xrayMode:false, showRoomLabels:true`.
- **Done:** store usable from UI and 3D, no React prop drilling.

### [x] T2.5 Floor slabs + corridor from data
- **Files:** `src/three/Floor.tsx` (upgrade), `src/three/Building.tsx` (upgrade)
- **Steps:** Floor renders slab + corridor + walls from `layout` (`width/depth/wallHeight`, `footprintSegments(shape)`), positioned at `floorBaseY(level)`. Building maps `floors` data → `<Floor level>` (no hardcoded 1/2). No rooms yet.
- **Done:** slabs driven by `layout.floorCount`/`shape`, still no classrooms.

### [x] T2.6 M2 verify (incl. configurability)
- **Steps:** console.log school tree, toggle store in devtools, confirm AC-15 separation (no room strings/sizes inside `three/`). Config check: set `floorCount: 4` → 4 slabs render; set `shape: 'U'` → wings render; revert to defaults.
- **Done:** N floors + straight/U driven by `layout.ts` only, data importable.

---

## [x] M3 — Spatial model → AC-04, AC-05 (DONE)

### [x] T3.1 Classroom shell
- **Files:** `src/three/Classroom.tsx`
- **Steps:** props `{room: Room}`. Group at `room.position`. Floor box `[w,0.1,d]`. 4 walls thickness 0.15 height 3.5, color by type (classroom `#f7f5ef`, lab `#eef4ff`, library `#fff6e6`, office `#eef7ee`). `onClick` → `selectRoom(room.id)` (wiring active from now, panel comes in M5 but harmless).
- **Done:** 1 room renders at correct spot when manually mounted.

### [x] T3.2 Door gap
- **Files:** `src/three/Door.tsx`, `Classroom.tsx` edit
- **Steps:** front wall split into two segments leaving 1.2m gap + door panel box `[1.1,2.2,0.08]` color `#8b5e34`, positioned corridor-side.
- **Done:** visible doorway per classroom.

### [x] T3.3 Windows
- **Files:** `src/three/Window.tsx`
- **Steps:** outer wall: 3 window boxes `[1.8,1.2,0.06]` color `#bfe3ff` emissive slight, spaced along X. Reusable `<Window position rotation>`.
- **Done:** daylight side recognizable.

### [x] T3.4 Furniture set
- **Files:** `src/three/Furniture.tsx`
- **Steps:** `<TeacherDesk/>` box + `<StudentDesk/>` (top + 2 legs simplified) + `<Board/>` plane on front wall + `<Shelf/>` for library/lab. `Furniture({kind})` switch. Classroom places 1 teacher + 6 student desks grid. Library: 4 shelves + 2 tables. Lab: 4 benches. Keep each <12 boxes.
- **Done:** ~100 boxes total, still 60fps.

### [x] T3.5 Wire 12 rooms
- **Files:** `src/three/Building.tsx` edit
- **Steps:** map `roomsByFloor` → `<Classroom key room={r}/>` inside correct `<Floor>`. Y-base from `floorBaseY(level)` in `data/layout.ts` (no local constants).
- **Done:** AC-04 — 12 rooms visible (default layout).

### [x] T3.6 Procedural stairs
- **Files:** `src/three/Stairs.tsx`
- **Steps:** props `{fromFloor,toFloor}`. 12 steps per flight: each `[2.5w,0.33h,0.9d]`, positioned at `stairsPosition(layout.shape)`, rising `layout.floorHeight`. Render one flight per adjacent floor pair (`floorCount-1` flights via map, not hardcoded). Plus 2 rail boxes. No collision logic. Always visible (exempt from floor dim/X-ray fade).
- **Done:** AC-05 — recognizable staircase(s) connecting all floors.

### [x] T3.7 Room labels
- **Files:** `src/three/RoomLabel.tsx`
- **Steps:** Drei `<Html center distanceFactor={20} position={[0,4.2,0]}>` showing `name` + `id` small pill. Render only if `showRoomLabels` from store. `occlude` off for V1.
- **Done:** "CLASS 5A / A201" floats above rooms.

### [x] T3.8 M3 verify
- **Steps:** orbit inside/outside, count 12 labels, check stairs from both floors.
- **Done:** spatial model complete.

---

## [x] M4 — Floor navigation → AC-06, AC-10 (DONE)

### [x] T4.1 FloorSelector UI
- **Files:** `src/ui/FloorSelector.tsx`, `src/ui/Sidebar.tsx` edit
- **Steps:** buttons generated from layout (`floorCount` entries + Ground disabled). Active = filled. onClick → `selectFloor(n)` + `setFocusTarget(floorCenter(n))`.
- **Done:** clicking changes store.

### [x] T4.2 CameraRig fly-to
- **Files:** `src/three/CameraRig.tsx`, `SchoolScene.tsx` edit
- **Steps:** inside Canvas: `useFrame` lerp `controls.target` → `focusTarget` and camera position → `focusTarget + offset [10,8,10]`. Speed `delta*3`, snap if <0.05. Listens to `focusTarget`. Default target `[0,2,0]`.
- **Done:** floor switch animates smoothly, orbit still works after.

### [x] T4.3 Floor dim logic
- **Files:** `src/three/Floor.tsx` edit
- **Steps:** if `floor.level !== selectedFloor`: group materials `transparent opacity 0.25`, or `visible=false` if far? V1: opacity dim, keep stairs full opacity. Pass `dimmed` prop.
- **Done:** Floor2 prominent when selected, Floor1 dimmed and vice versa.

### [x] T4.4 ControlsHelp + Reset View button
- **Files:** `src/ui/ControlsHelp.tsx`, `Sidebar.tsx` edit
- **Steps:** hints: left-drag orbit, right-drag pan, wheel zoom, click room, double-click focus. Reset button → `resetView()` + `setFocusTarget(DEFAULT)`.
- **Done:** AC-06, AC-10, AC-14 partial.

---

## [x] M5 — Selection → AC-07, AC-08, AC-09 (DONE)

### [x] T5.1 Click + highlight
- **Files:** `src/three/Classroom.tsx` edit
- **Steps:** `const selected = selectedRoomId===room.id`. If selected: wall/floor material `emissive="#ff8c00" emissiveIntensity={0.45}` + outline box helper. `onPointerMissed` on Canvas → `clearSelection()`. Cursor pointer on hover.
- **Done:** AC-07, AC-09 — selection obvious.

### [x] T5.2 RoomPanel
- **Files:** `src/ui/RoomPanel.tsx`
- **Steps:** fixed right card: name, Building A, Floor, Room id, Capacity, Type. Close X → clear. Render only if selectedRoom. Lookup via `roomsById`.
- **Done:** AC-08.

### [x] T5.3 Sidebar wiring
- **Files:** `src/ui/Sidebar.tsx` edit
- **Steps:** show selected room mini-row + clear button. Keep FloorSelector + toggles mounted (toggles functional in M7, render disabled until then or wire now).
- **Done:** 3D ↔ UI sync both ways.

### [x] T5.4 M5 verify
- **Steps:** click 5A → highlight + panel, click empty → deselect, click 5 rooms in row.
- **Done:** no stuck selection.

---

## [x] M6 — Search + focus → AC-11, AC-12, AC-14 (DONE)

### [x] T6.1 SearchBox filter
- **Files:** `src/ui/SearchBox.tsx`
- **Steps:** input + dropdown. Filter `rooms` by lowercase includes on `id/name/type` ("5A","library","A201","computer"). Show top 8: `name — Building A / Floor n / id`. Keyboard: Enter selects first, Esc clears.
- **Done:** AC-11.

### [x] T6.2 Select result → fly
- **Files:** `SearchBox.tsx` edit
- **Steps:** onSelect: `selectRoom(id)`, `selectFloor(roomFloor)`, `setFocusTarget(room.position + [0,2,0])`. Panel opens via M5 logic.
- **Done:** AC-12 — search "library" flies camera.

### [x] T6.3 Double-click focus
- **Files:** `src/three/Classroom.tsx` edit
- **Steps:** `onDoubleClick` → `setFocusTarget(room.position)`. Single click only selects (no fly) to avoid nausea.
- **Done:** power-user shortcut.

### [x] T6.4 Reset View final
- **Files:** `src/ui/Sidebar.tsx` or `Header.tsx` edit, `CameraRig.tsx` edit
- **Steps:** button sets `focusTarget=DEFAULT_TARGET`, camera pos `[20,18,20]`, clears room. Store `DEFAULT_CAM_POS/TARGET` in `data/layout.ts`.
- **Done:** AC-14.

---

## [x] M7 — Polish → AC-13 + Done (DONE)

### [x] T7.1 X-Ray mode
- **Files:** `src/three/Floor.tsx`, `Classroom.tsx` edit, `Sidebar.tsx` edit
- **Steps:** checkbox → `setXrayMode`. If `xrayMode && level > selectedFloor`: all meshes in floor `transparent opacity 0.15 depthWrite={false}`. Selected floor normal. Stairs exempt. Labels still show.
- **Done:** AC-13 — inspect Floor1 through Floor2.

### [x] T7.2 Labels toggle
- **Files:** `Sidebar.tsx`, `RoomLabel.tsx` edit
- **Steps:** checkbox → `setShowRoomLabels`. If false, render null. Optional: hide labels beyond 60m via `useFrame` distance check (nice-to-have, skip if time).
- **Done:** toggle works instantly.

### [x] T7.3 Visual + responsive polish
- **Files:** `src/index.css`, `SchoolScene.tsx`, `App.tsx` edits
- **Steps:** palette lock, `min-width:1280` hint bar for smaller screens, shadow map 1024 only, `dpr={[1,1.75]}`, no postprocessing.
- **Done:** clean architectural twin, 60fps desktop.

### [x] T7.4 Final gate AC-01..AC-15
- **Steps:** fresh `rm -rf node_modules && npm install && npm run dev`, walk checklist below, fix gaps before calling done.
- **Done:** Definition of Done quote passes.

---

---

# V2 — Campus Surroundings & U-Shape Building (from `docs/updated-req.md`)

Reuse, don't rebuild: R3F Canvas/camera/OrbitControls/lights in `SchoolScene.tsx`,
`Door`/`Window`/`Stairs`/`RoomLabel` components, `layout.ts` config pattern,
data→props threading (`App` → `SchoolScene` → `Building`).
Signs use Drei `Html` (same mechanism as `RoomLabel`) — no font downloads.
Each stage must keep `npm run dev` working with all V1 features intact
(select/search/floor/x-ray on the straight building until M11 switches default).

## [x] M8 — Campus ground: road + sidewalk (Stage 1, DONE)

### [x] T8.1 Campus config
- **Files:** `src/data/layout.ts` (extend)
- **Steps:** add `CampusLayout` + `DEFAULT_CAMPUS`: campus 80x100 (x −40..40, z −50..50),
  road {z: 42, width: 12, length: 100}, sidewalks, gate {z: 50, opening: 6},
  path {width: 6, from z=50 to z=22}, reception {pos: [0,0,18], 12x8x4},
  reception: {pos: [0,0,18], 12x8x4},
  buildingCenter {z: -15}, courtyard bounds, schoolyard slab, frontyard lawns. Helpers: `roadRect()`, `sidewalkRects()`, `gatePosts()`, `pathRect()`, `schoolyardRect()`, `frontyardRects()`.
- **Done:** `tsc` passes; zero literals for campus geometry outside this file.

### [x] T8.2 Ground + Road + Sidewalk
- **Files:** `src/three/Ground.tsx` (extend), `src/three/Road.tsx` (new), `src/three/SchoolScene.tsx` (mount)
- **Steps:** keep 100x100 grass plane; add campus plane 80x100 tone `#7fae67` at y=0.01.
  Road: asphalt box 100x12 `#3a3f45` at z=42 + 2 sidewalk strips `#c9ccd1` + center dashes
  (loop of small white boxes, reusable — no manual dozens). Mount in scene; no gate/reception/building changes.
- **Done:** grass + road + sidewalks visible; orbit/pan/zoom + V1 selection still work.

### [x] T8.3 M8 verify
- **Steps:** `npm run build`, dev screenshot from default camera; confirm road runs along X in front (+Z).
- **Done:** Stage 1 complete, nothing else added.

**Do not in M8:** gate, reception, U-building, trees.

---

## [x] M9 — Gate: pillars + opening + sign (Stage 2, DONE)

### [x] T9.1 Gate component
- **Files:** `src/three/Gate.tsx` (new), `SchoolScene.tsx` (mount)
- **Steps:** pillars from `gatePosts()`: 2 boxes 1x4x1 `#e8e2d4` at x=±3.5, z=50 (6m opening);
  top beam spanning pillars + Drei `Html` sign "AL-FALAH SCHOOL". Optional low perimeter
  walls along campus edges with gap at gate (4 thin boxes from campus bounds).
- **Done:** gate readable from default camera; opening clearly passable.

### [x] T9.2 M9 verify
- **Steps:** build + dev; check scale vs road (12m) and path alignment x=0.
- **Done:** Stage 2 complete.

---

## [x] M10 — Reception + entrance path (Stage 3, DONE)

### [x] T10.1 Entrance path
- **Files:** `src/three/EntrancePath.tsx` (new)
- **Steps:** 6m-wide plane/box strip from `pathRect()` (gate z=30 → reception z=22) color `#d8d2c4`,
  y=0.02. Must visually connect gate opening to reception door (same x=0 axis).
- **Done:** ROAD → GATE → PATH line reads clearly from overview.

### [x] T10.2 Reception building
- **Files:** `src/three/Reception.tsx` (new)
- **Steps:** 12x8x4 box + flat roof + front glass strip (emissive-ish `#bfe3ff` boxes,
  reuse `Window`) + door (reuse `Door`) facing +Z + Html sign "RECEPTION".
  Position from campus config (front center of future U, z≈18).
- **Done:** recognizable entrance building; no interior needed.

### [x] T10.3 M10 verify
- **Steps:** build + dev; confirm ROAD → GATE → PATH → RECEPTION chain from default camera.
- **Done:** Stage 3 complete.

---

## [x] M11 — U-shaped building: wings + U room layout (Stage 4, DONE)

### [x] T11.1 Wing dimensions in config
- **Files:** `src/data/layout.ts` (extend)
- **Steps:** replace U placeholder with real wings per updated-req §12:
  rear 50x12 (center z≈-21), left/right 12x35 (x=∓19, extending south to z≈+14),
  height 8 (2 floors x 4m). `footprintSegments('U')` returns these 3 rects;
  courtyard = rect between wings (x −13..13, z −15..+14). Open side faces +Z.
  Keep `straight` working via config (tests), default stays `straight` until T11.3.
- **Done:** unit-checked rects connect without gaps/overlaps.

### [x] T11.2 U room placement
- **Files:** `src/data/rooms.ts` (extend `generateRooms`)
- **Steps:** branch on `layout.shape`: rear wing → row of rooms along X (corridor on courtyard side);
  side wings → single-loaded column along Z (rooms 7 deep, corridor strip facing courtyard).
  Same 12-room V1 roster on default floorCount 2; `A{level}0{n}` naming preserved;
  stairs zone from `stairsPosition('U')` kept free. Straight branch untouched.
- **Done:** all rooms inside wing rects, none in courtyard; 4-floor still generates.

### [x] T11.3 Switch default + stairs
- **Files:** `src/data/layout.ts` (`DEFAULT_LAYOUT`: shape `'U'`, width 50, depth per wings),
  verify `Stairs.tsx` + `Building.tsx` need no code changes (flights per pair, anchor from config).
- **Steps:** flip default, run build + dev: 3 wings form clean U, courtyard open to +Z,
  V1 rooms render inside wings, stairs connect floors, selection/search/floor/x-ray still work.
- **Done:** Stage 4 complete; straight remains one config line away.

---

## [ ] M12 — Building details reuse (Stage 5)

### T12.1 Windows/doors/stairs pass
- **Files:** `Classroom.tsx`, `Reception.tsx`, `Stairs.tsx` (minor edits only)
- **Steps:** confirm wing rooms get windows (outer walls) + doors (corridor side) via existing
  components; reception door + glass via reuse; ≥1 stair flight visible. No new components
  unless a gap is found; no external assets.
- **Done:** two visual floors visible, windows/doors/stairs present on U-building.

### T12.2 M12 verify
- **Steps:** build + dev screenshot; count wings/doors/windows qualitatively.
- **Done:** Stage 5 complete.

---

## [ ] M13 — Courtyard + landscaping (Stage 6)

### T13.1 Courtyard
- **Files:** `src/three/Courtyard.tsx` (new)
- **Steps:** grass plane over courtyard bounds (tone slightly lighter `#92bd76`, y=0.02)
  + cross walking path (2 thin strips `#d8d2c4`) + 2 benches (2-box reuse pattern).
- **Done:** courtyard reads as green open space inside U.

### T13.2 Trees + bushes
- **Files:** `src/three/Tree.tsx` (new: cylinder trunk + sphere/cone leaves, props `{position, scale}`)
- **Steps:** place ~8 trees from a config array (courtyard corners, campus edges, near gate —
  positions in `layout.ts`, not in component); 4 bushes (spheres). All primitives.
- **Done:** believable landscaping, still 60fps, no external models.

### T13.3 M13 verify
- **Steps:** build + dev; confirm trees don't block gate→reception axis or room clicks.
- **Done:** Stage 6 complete.

---

## [ ] M14 — Campus polish + final gate (Stage 7)

### T14.1 Composition pass (no new features)
- **Files:** `SchoolScene.tsx` (camera default), lights, materials only
- **Steps:** default camera to elevated overview showing ROAD → GATE → RECEPTION → U-BUILDING →
  COURTYARD (e.g. pos [34,30,52], target [0,2,6]); confirm sun distinguishes building/road/
  grass/gate/courtyard/windows; tidy proportions/spacing; Html labels for Gate/Reception/
  Courtyard (small, non-interactive).
- **Done:** coherent low-poly campus composition.

### T14.2 V2 acceptance (updated-req §29)
- **Steps:** fresh `npm install && npm run build && npm run dev`, walk every box:
- **Done:** all checked:
  - [ ] Ground, road in front, sidewalk, gate with 2 pillars + opening, school name visible
  - [ ] Path connects gate→school, reception visible with entrance
  - [ ] U-shape: left/right/rear wings, open side faces entrance, courtyard inside, ≥2 floors,
        windows, doors, ≥1 staircase
  - [ ] Courtyard grass, several trees, clear spatial relationships
  - [ ] Orbit/zoom/pan work, useful start view, V1 features (select/search/floor/x-ray) unbroken
  - [ ] Architecture preserved (R3F kept), reusable components, layout values in `layout.ts`, no errors

## Final checklist (V1, keep checked)

- [ ] AC-01 runs with npm install/dev
- [ ] AC-02 building visible, AC-03 two floors, AC-04 12 rooms, AC-05 stairs
- [ ] AC-06 orbit/pan/zoom, AC-07 click, AC-08 info, AC-09 highlight
- [ ] AC-10 floor switch, AC-11 search, AC-12 camera focus, AC-13 x-ray, AC-14 reset, AC-15 separation
- [ ] Done when: "I can open, rotate, choose floor, click 5A, see info, search library, camera flies there."
