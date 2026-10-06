# Customizing 3D — Buildings, Layout, Rooms, Models

How to change what the school looks like, from easiest (edit numbers)
to most powerful (model in a visual 3D tool and import the result).

Rule of thumb: **positions and sizes live in `src/data/layout.ts`,
never inside `src/three/` components.** That separation (AC-15) is what
keeps every method below safe.

Conventions everything must follow:
- `1 unit = 1 meter`, Y is up, front/entrance faces **+Z**.
- Room doors face the room's local **+Z** (`rotationY` turns the whole room).
- `npm run build` must stay green after every change.

---

## Level 1 — Edit numbers in `src/data/layout.ts` (no 3D knowledge needed)

This covers ~80% of customization. Change a value, reload, done.

**Building** (`DEFAULT_LAYOUT`):
- More floors: `floorCount: 2` → `4`. Floors, rooms (`A301…`), stairs flights,
  and floor buttons regenerate automatically.
- Straight school instead of U: `shape: 'U'` → `'straight'`
  (uses `width`/`depth` instead of `wings`).
- Bigger courtyard: shrink `sideDepth` (wings get shorter) or widen the gap
  by reducing `sideWidth`. Move the whole U mouth with `mouthZ`.
- Taller rooms: `floorHeight` / `wallHeight`.

**Campus** (`DEFAULT_CAMPUS`):
- Move road/gate/path/reception: `road.z`, `gate.z`, `path.fromZ/toZ`,
  `reception: { x, z, width, depth, height }`.
- Bigger schoolyard: `schoolyard: { halfWidth, backZ, frontZ }`.
  The gate auto-sits on `frontZ` only if you keep `gate.z` equal to it —
  remember to move both together.

**Camera start view:** `DEFAULT_CAM_POS` / `DEFAULT_CAM_TARGET`.

Verify with: `npx tsc --noEmit && npm run build`.

---

## Level 2 — Change room roster and components (basic React + TS)

**Room list** (`src/data/rooms.ts`): edit the `FLOOR_1` / `FLOOR_2` template arrays
(name, `type`, `capacity`, `width`). Slots 0–3 go to the rear wing,
slot 4 to the left wing, slot 5 to the right wing (U-shape).
`generateRooms()` computes positions — never hand-place a room.

**Look of one room type** (`src/three/`):
- Wall colors per type: `WALL_BY_TYPE` in `Classroom.tsx`.
- Furniture: `Furniture.tsx` (`classroom` / `library` / `lab` / `office` kinds) —
  copy an existing piece (box + color), place it with a `position`.
- Doors/windows: `Door.tsx` / `Window.tsx` are reusable; change size/color once,
  every room updates.
- Stairs: `Stairs.tsx` (`STEPS`, `WIDTH`, `RUN` constants).

Keep components data-driven (props in, meshes out). If you catch yourself
typing a room name or coordinate into a file under `src/three/`, stop —
that value belongs in `src/data/`.

---

## Level 3 — Draw visually in a 3D tool, import the result

For shapes too complex for boxes (a nicer gate, a mosque dome, a playground,
custom furniture). All tools below export **GLB**, which this stack
(three + drei) loads natively.

| Tool | Cost | Best for | Notes |
|---|---|---|---|
| **Blender** | free | anything; full control | Industry standard. Model → `File → Export → glTF (.glb)`. Recommended path. |
| **three.js editor** (`threejs.org/editor`) | free | quick primitive mockups | Runs in browser, no install; export scene/object as GLB. Good for trying ideas fast. |
| **Spline** (spline.design) | freemium | simple stylized props | Very easy; exports GLB on paid tiers (free tier: screenshot/reference rebuild). |
| **MagicaVoxel** | free | blocky low-poly (trees, benches) | Matches our low-poly style perfectly; export OBJ → convert to GLB in Blender. |
| **Tinkercad** (web) | free | simple constructions | Beginner-friendly; export STL/OBJ → Blender → GLB. |
| Ready-made assets | free | fast content | **Quaternius** (quaternius.com, CC0 low-poly packs) or **Sketchfab** (filter downloadable). Check license. |

### Blender → app workflow (example: a custom gate)

1. Model in Blender with **1 unit = 1 meter**, object origin at its ground center
   (so `position` in our config puts its feet on the ground).
2. Apply transforms (`Ctrl+A → All Transforms`), export `.glb`
   (keep materials simple: Principled BSDF with base color only).
3. Put it in `public/models/gate.glb` (files under `public/` are served as-is).
4. Wrap it in a component that takes position from config, same as today:

```tsx
import { useGLTF } from '@react-three/drei';

export default function CustomGate({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/gate.glb');
  return <primitive object={scene.clone()} position={position} />;
}
```

5. Mount it in `SchoolScene.tsx` where `Gate` is mounted today, passing the
   position from `gatePosts()` — the data/3D separation stays intact.
6. Preload once: `useGLTF.preload('/models/gate.glb')`.

Tips: keep poly counts low (hundreds–low thousands per prop), reuse one model
many times (trees, benches) instead of unique meshes, and prefer flat colors
over textures to keep the architectural look.

---

## Quick decision guide

- Move/resize/add floors, wings, road, gate, rooms → **Level 1** (config).
- New room type, different furniture, different colors → **Level 2** (templates/components).
- Organic/custom shapes impractical in boxes → **Level 3** (model visually, import GLB, position from config).

If you're unsure which level a change needs, start at Level 1 — most
"redesign the school" requests turn out to be number changes.
