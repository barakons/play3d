# 3D School Visualization

## Product Requirements Document — V1

**Version:** 1.0
**Status:** Development Ready
**Target:** Web application
**Primary goal:** Interactive 3D visualization of a school building, rooms, floors, and basic school information.

---

# 1. Product Vision

Create a web application that allows users to visually explore a school in an interactive 3D environment.

Instead of representing the school only as:

* tables
* lists
* maps
* floor plans

the application represents the school as a navigable **3D spatial model**.

Users should be able to:

1. Explore the school in 3D.
2. Navigate between floors.
3. Identify classrooms and other rooms.
4. Click a room to see its information.
5. Search for a room/class.
6. Automatically move the camera to a selected room.
7. Understand the relationship between buildings, floors, stairs, and rooms.

The application should be designed so that future versions can connect the 3D model to real school data such as students, teachers, schedules, attendance, room utilization, and school analytics.

---

# 2. V1 Scope

V1 focuses on the **3D spatial experience**, not full school management.

### Included

* One school campus
* One building
* Two floors
* Ground/terrain
* Classrooms
* Stairs
* Basic doors/windows
* Basic furniture
* Room labels
* 3D camera navigation
* Floor selector
* Room selection
* Room information panel
* Room search
* Camera navigation to selected room
* Room highlighting
* X-ray/transparent floor mode
* Responsive desktop web UI
* Mock/static school data

### Not Included

Do NOT implement these in V1:

* Student management
* Teacher management
* Attendance
* Authentication
* Role management
* Payment
* School ERP
* Real-time data
* IoT
* Live sensors
* AI chatbot
* Mobile native application
* Complex 3D character animation
* Photorealistic rendering
* VR/AR
* Multiplayer
* Real-world GIS integration

These may become future features.

---

# 3. Target Users

## 3.1 School Administrator

Wants to understand and navigate the physical school.

Example:

> "Where is Class 5B?"

The application should allow the administrator to search for `5B` and immediately locate the classroom.

---

## 3.2 Teacher

Wants to quickly locate classrooms and facilities.

Example:

> "Where is the science laboratory?"

The application should highlight the laboratory and move the camera there.

---

## 3.3 Student / Visitor

Wants to explore the school.

Example:

> "Where is the library?"

The application should provide a visual route/location.

---

# 4. Core User Experience

The application opens to a 3D view.

Example:

```text
┌─────────────────────────────────────────────────────────┐
│ 🏫 Al-Falah School                    🔍 Search         │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│ FLOORS       │                                          │
│              │             3D SCHOOL                   │
│ ● Floor 2    │                                          │
│ ○ Floor 1    │       ┌──────────────┐                   │
│              │       │   CLASS 5A   │                   │
│              │       └──────────────┘                   │
│              │                │                         │
│              │              STAIRS                      │
│              │                │                         │
│              │       ┌──────────────┐                   │
│              │       │   CLASS 4A   │                   │
│              │       └──────────────┘                   │
│              │                                          │
│              │                         ┌──────────────┐ │
│              │                         │ Room details │ │
│              │                         └──────────────┘ │
└──────────────┴──────────────────────────────────────────┘
```

---

# 5. Technology Stack

## Frontend

Use:

* React
* TypeScript
* Vite
* React Three Fiber
* Three.js
* Drei
* Zustand
* Tailwind CSS

## Backend

V1 does not require a backend.

Use static TypeScript/JSON data.

Future:

```text
React
   ↓
Node.js API
   ↓
PostgreSQL
```

---

# 6. Architecture

The application should separate:

1. School data
2. Application state
3. 3D rendering
4. Normal UI

Recommended structure:

```text
src/
│
├── app/
│   └── App.tsx
│
├── data/
│   ├── school.ts
│   ├── buildings.ts
│   ├── floors.ts
│   └── rooms.ts
│
├── three/
│   ├── SchoolScene.tsx
│   ├── Ground.tsx
│   ├── Building.tsx
│   ├── Floor.tsx
│   ├── Classroom.tsx
│   ├── Stairs.tsx
│   ├── Door.tsx
│   ├── Window.tsx
│   ├── Furniture.tsx
│   └── RoomLabel.tsx
│
├── ui/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── FloorSelector.tsx
│   ├── SearchBox.tsx
│   ├── RoomPanel.tsx
│   └── ControlsHelp.tsx
│
├── state/
│   └── schoolStore.ts
│
└── types/
    └── school.ts
```

The 3D components must not contain school business data directly.

---

# 7. School Data Model

The school should be represented as structured data.

## School

```ts
type School = {
  id: string;
  name: string;
  buildings: Building[];
};
```

## Building

```ts
type Building = {
  id: string;
  name: string;
  floors: Floor[];
};
```

## Floor

```ts
type Floor = {
  id: string;
  buildingId: string;
  level: number;
  name: string;
  rooms: Room[];
};
```

## Room

```ts
type Room = {
  id: string;
  floorId: string;

  name: string;

  type:
    | "classroom"
    | "laboratory"
    | "library"
    | "office"
    | "toilet"
    | "hall";

  position: [number, number, number];

  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  capacity?: number;
};
```

---

# 8. Initial School Dataset

Create one fictional school.

### School

```text
Al-Falah School
```

### Building

```text
Building A
```

### Floor 1

```text
A101 — Class 1A
A102 — Class 1B
A103 — Class 2A
A104 — Class 2B
A105 — Library
A106 — Teacher Room
```

### Floor 2

```text
A201 — Class 5A
A202 — Class 5B
A203 — Class 6A
A204 — Class 6B
A205 — Laboratory
A206 — Computer Lab
```

---

# 9. 3D Coordinate System

Use a simple world coordinate system.

```text
           Y
           ↑
           │
           │
           └────────→ X
          /
         /
        Z
```

Use:

```text
X = left/right
Y = vertical
Z = depth
```

Recommended initial scale:

```text
1 Three.js unit = 1 meter
```

This makes the spatial model easier to reason about.

Example:

```text
Classroom:

width  = 8m
height = 3.5m
depth  = 7m
```

---

# 10. 3D Building

The building should initially use simple Three.js primitives.

Do NOT require external 3D models.

Use:

* BoxGeometry
* PlaneGeometry
* CylinderGeometry where useful

Example:

```text
Building
│
├── Floor
├── Walls
├── Roof
├── Rooms
├── Doors
├── Windows
└── Stairs
```

The visual style should be:

**clean low-poly / architectural visualization**

rather than photorealistic.

---

# 11. Classroom

Every classroom must be represented by a reusable component.

Example:

```tsx
<Classroom
  room={room}
/>
```

A classroom should visually contain:

* floor
* four walls
* ceiling/roof where appropriate
* door
* windows
* teacher desk
* student desks/chairs
* basic board

Furniture can be simplified.

The purpose is spatial visualization, not architectural construction accuracy.

---

# 12. Stairs

Create a reusable procedural staircase component.

Example:

```tsx
<Stairs
  fromFloor={1}
  toFloor={2}
/>
```

The staircase should be generated from repeated steps.

Requirements:

* Connect Floor 1 and Floor 2.
* Be visually recognizable.
* Have a reasonable width.
* Allow camera navigation around it.
* Be visible in normal 3D mode.
* Work correctly with X-ray mode.

---

# 13. 3D Camera

Use React Three Fiber + Drei camera controls.

Required interactions:

### Left mouse drag

Orbit camera.

### Right mouse drag

Pan.

### Mouse wheel

Zoom.

### Double click room

Move camera toward the room.

The camera animation should be smooth.

---

# 14. Lighting

Use simple lighting.

Required:

* Ambient light
* Directional light

Optional:

* Hemisphere light

Do not implement complex physically based lighting in V1.

The objective is clarity.

---

# 15. Ground

Create a simple school ground.

Include:

* grass/ground plane
* building footprint
* optional walkway

Future versions may add:

* parking
* sports field
* garden
* trees
* gate
* road

These are out of scope for V1.

---

# 16. Room Labels

Rooms should optionally display a floating 3D label.

Example:

```text
        ┌─────────────┐
        │             │
        │   CLASS 5A  │
        │             │
        └─────────────┘
              ↑
          "A201"
```

Use Drei `Html` or text functionality.

Labels should become more/less visible depending on camera distance if practical.

---

# 17. Room Selection

Every interactive room must be clickable.

When the user clicks:

```text
Class 5A
```

the application should:

1. Select the room.
2. Highlight the room.
3. Store its ID in global state.
4. Open the room information panel.
5. Optionally move the camera toward the room.

Selected room example:

```text
┌────────────────────────────┐
│ CLASS 5A                   │
│                            │
│ Building: A                │
│ Floor: 2                   │
│ Room: A201                 │
│ Capacity: 30               │
│                            │
│ Type: Classroom            │
└────────────────────────────┘
```

---

# 18. Room Highlighting

Selected rooms must be visually distinguishable.

Possible implementation:

```text
normal room
    ↓
normal material

selected room
    ↓
highlight material
```

The exact color scheme is not fixed.

The important requirement is that selection is immediately obvious.

---

# 19. Floor Selector

Provide a normal HTML UI component:

```text
FLOOR

● 2
○ 1
○ Ground
```

Selecting Floor 2 should:

* make Floor 2 prominent
* optionally dim/hide Floor 1
* move the camera toward Floor 2
* keep stairs visible where appropriate

Selecting Floor 1 should perform the inverse.

---

# 20. X-Ray Mode

Provide:

```text
[ X-Ray Mode ]
```

When enabled:

* upper floors become semi-transparent
* selected floor remains visible
* rooms beneath become visible
* the user can inspect internal structure

Example:

```text
Floor 2
████████████  ← transparent

Floor 1
████████████  ← normal
```

---

# 21. Search

Add a search box:

```text
🔍 Search room...
```

Search should match:

* room ID
* room name
* room type

Examples:

```text
"5A"
"library"
"A201"
"computer"
```

Results:

```text
Class 5A
Building A / Floor 2 / A201
```

Selecting a result should:

1. Select the room.
2. Highlight it.
3. Move the camera to it.
4. Display the information panel.

---

# 22. Sidebar

The sidebar should contain:

```text
SCHOOL
Al-Falah School

NAVIGATION

Floor
[ 2 ]
[ 1 ]

SEARCH

[ 🔍 Search room ]

DISPLAY

☐ X-Ray Mode
☐ Room Labels
```

Keep the sidebar simple.

---

# 23. Application State

Use Zustand for shared state.

Minimum state:

```ts
type SchoolState = {
  selectedRoomId: string | null;

  selectedFloor: number;

  xrayMode: boolean;

  showRoomLabels: boolean;

  selectRoom: (id: string) => void;

  selectFloor: (floor: number) => void;

  setXrayMode: (enabled: boolean) => void;

  setShowRoomLabels: (enabled: boolean) => void;
};
```

---

# 24. Separation of Responsibilities

This is a critical architectural requirement.

## Data

Responsible for:

```text
What rooms exist?
Where are they?
What type are they?
```

## State

Responsible for:

```text
What is selected?
What floor is active?
Is X-ray enabled?
```

## 3D components

Responsible for:

```text
How does a classroom look?
How does a staircase look?
How does a building look?
```

## UI

Responsible for:

```text
How does the user interact with the application?
```

Do not mix these responsibilities unnecessarily.

---

# 25. Performance Requirements

V1 should target:

```text
Desktop browser
60 FPS target
```

The initial model should contain approximately:

```text
1 building
2 floors
12 rooms
1 staircase
~100 pieces of furniture
```

Do not optimize prematurely.

However, components should be structured so that future versions can use:

* instancing
* asset reuse
* level of detail
* simplified geometry

---

# 26. Responsive Requirements

V1 primarily targets:

```text
Desktop
Laptop
```

Minimum recommended resolution:

```text
1280 × 720
```

Tablet/mobile optimization is not required for V1.

---

# 27. Visual Style

The application should feel like:

**modern architectural digital twin**

Characteristics:

* clean
* minimal
* slightly stylized
* low-poly
* readable
* professional

Avoid:

* photorealistic textures
* excessive shadows
* complicated particle effects
* game-like HUD
* unnecessary animations

---

# 28. Navigation Requirements

The user must be able to:

### Free exploration

Orbit around the school.

### Floor navigation

Select a floor.

### Room navigation

Search/select a room.

### Automatic camera navigation

Application smoothly moves camera toward selected object.

### Reset view

Provide:

```text
[ Reset View ]
```

which returns the camera to the default school overview.

---

# 29. Future Architecture

The V1 architecture must allow future integration:

```text
                    PostgreSQL
                        │
                        ↓
                    Node.js API
                        │
                        ↓
                  React Application
                        │
          ┌─────────────┴─────────────┐
          ↓                           ↓
      Normal UI                  3D Visualization
          │                           │
          └─────────────┬─────────────┘
                        ↓
                   School Model
```

Future data could include:

```text
Students
Teachers
Classes
Schedules
Attendance
Room utilization
Equipment
Facilities
Maintenance
Energy
Security
```

---

# 30. Future Features

These are deliberately NOT part of V1.

## V2 — School Data

* students
* teachers
* classes
* schedules
* classroom assignments

## V3 — Analytics

* room utilization
* student density
* attendance visualization
* teacher movement
* capacity analysis

## V4 — Digital Twin

* live sensor data
* temperature
* electricity
* occupancy
* IoT devices
* maintenance status

## V5 — Navigation

* route from Room A → Room B
* shortest path
* wheelchair-accessible route
* emergency evacuation route

## V6 — Advanced 3D

* realistic GLB models
* outdoor campus
* multiple buildings
* trees
* vehicles
* people
* animations

---

# 31. V1 Acceptance Criteria

The V1 is considered complete when all of the following work:

### AC-01 — Application

The application starts successfully with:

```bash
npm install
npm run dev
```

### AC-02 — 3D Scene

A school building is visible in a 3D scene.

### AC-03 — Floors

The building has two floors.

### AC-04 — Rooms

At least 12 rooms are represented.

### AC-05 — Stairs

A visible staircase connects the two floors.

### AC-06 — Camera

User can:

* orbit
* pan
* zoom

### AC-07 — Room Selection

User can click a room.

### AC-08 — Room Information

Clicking a room displays its information.

### AC-09 — Highlight

Selected room is visually highlighted.

### AC-10 — Floor Selection

User can switch between Floor 1 and Floor 2.

### AC-11 — Search

User can search for a room.

### AC-12 — Camera Focus

Selecting a search result moves the camera to the room.

### AC-13 — X-Ray

X-ray mode makes the building/floors transparent enough to inspect the selected floor.

### AC-14 — Reset

Reset View returns to the default camera position.

### AC-15 — Architecture

School data is separated from 3D rendering components.

---

# 32. Development Strategy

Build incrementally.

## Milestone 1

```text
React
+
R3F
+
one box
```

Goal: prove Three.js works.

---

## Milestone 2

```text
Ground
+
Building
+
Floor
```

Goal: basic school building.

---

## Milestone 3

```text
12 Classrooms
+
Stairs
```

Goal: complete spatial model.

---

## Milestone 4

```text
Camera Controls
+
Floor Selector
```

Goal: navigation.

---

## Milestone 5

```text
Room Click
+
Room Panel
```

Goal: 3D ↔ normal UI interaction.

---

## Milestone 6

```text
Search
+
Camera Focus
+
Highlight
```

Goal: useful navigation.

---

## Milestone 7

```text
X-Ray
+
Labels
+
Reset View
```

Goal: polished V1.

---

# 33. Coding Guidelines for AI/Vibe Coding

When using an AI coding agent, follow these rules.

### Rule 1

Do not ask the AI to build the entire application in one prompt.

### Rule 2

Each milestone should produce a runnable application.

### Rule 3

Prefer reusable components.

Bad:

```tsx
School.tsx
// 2,000 lines
```

Good:

```text
SchoolScene
Building
Floor
Classroom
Stairs
Furniture
```

### Rule 4

Keep school data outside 3D components.

### Rule 5

Do not introduce external 3D assets until the basic application works.

### Rule 6

Do not introduce backend/database until the spatial model works.

### Rule 7

Do not optimize Three.js performance until there is an actual performance problem.

---

# 34. Definition of Done

The V1 should feel like this:

> "I can open the website, see a 3D school, rotate around it, choose a floor, click Class 5A, see its information, search for the library, and have the camera automatically fly to the library."

If that experience works smoothly, **V1 is done**.

The application should NOT attempt to become a complete school management system yet.

---

# 35. First Vibe-Coding Prompt

Use this as the first prompt to your coding agent:

> Build Milestone 1 of the 3D School Visualization application.
>
> Create a new React + TypeScript + Vite project using React Three Fiber, Three.js, Drei, Tailwind CSS, and Zustand.
>
> Create a full-screen application with a simple professional UI.
>
> Create a Three.js scene containing:
>
> 1. A ground plane.
> 2. A simple rectangular school building made entirely from Three.js primitive geometries.
> 3. Two floors.
> 4. Basic lighting.
> 5. A perspective camera.
> 6. Drei camera controls supporting orbit, pan, and zoom.
>
> Do not use external 3D models, GLB files, Blender assets, textures, or backend APIs.
>
> Create the following initial component structure:
>
> `SchoolScene.tsx`
> `Ground.tsx`
> `Building.tsx`
> `Floor.tsx`
>
> Keep the 3D rendering components separate from application UI.
>
> Create a simple top header containing "Al-Falah School" and a small sidebar showing "Floor 1" and "Floor 2", although floor switching does not need to work yet.
>
> The application must run with:
>
> `npm install`
>
> `npm run dev`
>
> Keep the implementation clean and easy for a developer who is new to Three.js to understand.
>
> Do not implement features beyond this milestone.

---

## The key principle

Don't think of this project as:

**"I need to learn Three.js and then build a school."**

Think:

**"I am building a normal React application, and one component happens to be a 3D viewport."**

That mental model will make this project *much* easier.

And for your particular goal, I'd strongly recommend **not cloning the seaport project wholesale**. Use its architecture as inspiration, but build the school model from scratch with only ~5–10 Three.js concepts initially. That will give you a much cleaner foundation for eventually connecting it to the Node.js/data systems you're already comfortable with.
