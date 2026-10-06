# 3D School Campus — Surrounding & U-Shape Building

## 1. Objective

Extend the existing Three.js school visualization sample into a simple **3D school campus environment**.

The goal is not photorealism.

The goal is to create a believable school environment that can later become the foundation for:

* school building visualization
* classroom navigation
* floor navigation
* room selection
* school facility visualization
* digital-twin style visualization

The implementation should remain **simple, modular, and beginner-readable** because this project will be developed incrementally using an AI coding agent.

---

# 2. Important Constraint

## DO NOT rebuild the existing application

The project already contains a working Three.js application.

The agent must:

1. Inspect the existing project first.
2. Understand the current rendering architecture.
3. Reuse the existing Three.js setup.
4. Reuse existing camera, lighting, controls, and components where appropriate.
5. Extend the existing application rather than replacing it.
6. Avoid unnecessary dependencies.
7. Avoid introducing React Three Fiber unless it already exists in the project.
8. Keep the existing application running after every change.

Before modifying anything, identify:

* entry point
* scene creation
* renderer
* camera
* controls
* lighting
* existing 3D objects/components
* animation/render loop
* existing styling/UI

---

# 3. Target Experience

The user should be able to open the application and see something resembling a small school campus.

Conceptually:

```text
                         BACK
              ┌──────────────────────┐
              │                      │
              │   SCHOOL BUILDING    │
              │                      │
              │                      │
              │                      │
              │                      │
              │                      │
              └───────┐      ┌───────┘
                      │      │
                      │      │
                      │      │
                      │      │
                      │      │
                      └──────┘
                       COURTYARD

                RECEPTION / LOBBY
                       │
                       │
                 MAIN ENTRANCE
                       │
═══════════════════════╪══════════════════
              ROAD IN FRONT
═══════════════════════╪══════════════════
                       │
                    STREET
```

The building should have a **U-shaped layout**.

The open side of the U should face the school's main entrance / road.

---

# 4. Campus Components

The initial campus should contain:

1. Ground / terrain
2. Road in front of the school
3. School perimeter
4. Main gate
5. Gate pillars
6. Gate opening
7. Entrance path
8. Reception / lobby
9. U-shaped school building
10. Courtyard inside the U
11. Basic landscaping
12. Basic lighting
13. Camera controls

Do not add detailed furniture or realistic architectural assets yet.

---

# 5. Coordinate System

Use a simple coordinate convention.

```text
X = left / right
Y = vertical
Z = front / back
```

Ground:

```text
Y = 0
```

Buildings and objects should be positioned relative to the ground.

Use approximately:

```text
1 Three.js unit = 1 meter
```

This does not need to be architecturally accurate yet.

The important thing is to establish a consistent coordinate system.

---

# 6. Campus Layout

Create a campus approximately:

```text
Width: 80m
Depth: 100m
```

These dimensions are approximate and can be adjusted to make the scene look good.

The school building should occupy the rear/middle portion of the campus.

The road should be positioned outside the main entrance.

---

# 7. Road

Create a simple road in front of the school.

Example:

```text
Road width: 12m
Road length: 100m
```

The road should run horizontally across the scene.

Use simple geometry.

Suggested appearance:

* dark asphalt surface
* simple sidewalk
* optional center line
* optional edge lines

Do not create realistic road markings yet.

The road is primarily there to establish **context and orientation**.

---

# 8. School Gate

Create a simple main gate between the road and school campus.

The gate should contain:

### Gate pillars

Two vertical pillars.

Example:

```text
Pillar height: 4m
Pillar width: 1m
```

### Gate opening

Leave an opening between the pillars.

Example:

```text
Opening width: 6m
```

### Gate roof / sign

Optionally add a simple horizontal structure above the entrance.

Add a school name:

```text
AL-FALAH SCHOOL
```

The text can be simple Three.js text or an existing text/label mechanism in the project.

Do not spend time creating a sophisticated gate.

---

# 9. Entrance Path

Create a pedestrian/vehicle path from the main gate toward the reception.

Example:

```text
Width: 6m
```

The path should visually connect:

```text
ROAD
  ↓
MAIN GATE
  ↓
ENTRANCE PATH
  ↓
RECEPTION
```

---

# 10. Reception / Lobby

Create a small reception building near the front center of the U-shaped school.

The reception acts as the main entrance.

Suggested dimensions:

```text
Width: 12m
Depth: 8m
Height: 4m
```

The reception should have:

* main entrance
* simple roof
* front facade
* optional glass/window area
* sign saying:

```text
RECEPTION
```

Keep the geometry simple.

The reception does not need detailed interior furniture yet.

---

# 11. U-Shaped School Building

The main school building should have a **U-shaped layout**.

Concept:

```text
┌──────────────────────────────┐
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
└──────────────┐    ┌──────────┘
               │    │
               │    │
               │    │
               │    │
               │    │
               └────┘
```

However, the actual open side of the U should face toward the front entrance.

The building consists of three wings:

### Left wing

Runs from the rear toward the front.

### Right wing

Runs from the rear toward the front.

### Rear wing

Connects the two wings.

Together they form:

```text
┌─────────────────────┐
│                     │
│                     │
│                     │
│                     │
│                     │
└───────┐       ┌─────┘
        │       │
        │       │
        │       │
```

The center should remain open.

---

# 12. Building Dimensions

Use approximate dimensions:

### Rear wing

```text
Width: 50m
Depth: 12m
Height: 8m
```

### Left wing

```text
Width: 12m
Depth: 35m
Height: 8m
```

### Right wing

```text
Width: 12m
Depth: 35m
Height: 8m
```

These dimensions are guidelines rather than strict architectural requirements.

The agent should adjust positions so that the three wings connect cleanly.

---

# 13. Courtyard

The empty space inside the U becomes the school courtyard.

The courtyard should contain:

* grass
* simple walking path
* optionally a few trees
* optionally benches

Initially keep it simple.

Example:

```text
        REAR WING
┌───────────────────────────┐
│                           │
│       COURTYARD           │
│                           │
│                           │
│                           │
└──────┐               ┌────┘
       │               │
       │               │
       │               │
       │               │
       └───── ENTRANCE ┘
```

---

# 14. Windows

Add simple windows to the school building.

Do not create detailed window frames.

A window can simply be:

```text
small rectangle
+
slightly different material/color
```

Windows should be repeated along the building walls.

The agent should create a reusable function/component such as:

```text
createWindow()
```

or equivalent.

Avoid manually creating dozens of unrelated window objects.

---

# 15. Doors

Add simple doors to the building.

At minimum:

* main reception door
* several school building doors

Doors can initially be simple rectangular geometry.

Create a reusable function/component:

```text
createDoor()
```

---

# 16. Floors

The school building should visually support multiple floors.

For the first version:

```text
Ground floor
First floor
```

The building can simply be represented as two stacked levels.

Example:

```text
       ┌──────────────────┐
  2F   │                  │
       ├──────────────────┤
  1F   │                  │
       └──────────────────┘
              GROUND
```

Do not create detailed classrooms yet unless the existing application already has them.

The purpose of this iteration is **campus structure and building massing**.

---

# 17. Stairs

Add simple stairs connecting the ground level to the upper floor.

At least one staircase should be visible.

The stairs can be generated from repeated boxes.

Example:

```text
      ┌───
     ┌───
    ┌───
   ┌───
  ┌───
```

Create a reusable staircase generator rather than manually positioning every step.

---

# 18. Landscaping

Add very simple landscaping around the campus.

Include:

* grass
* several trees
* optional bushes
* sidewalk

Trees can initially be made from simple primitives:

```text
cylinder = trunk
sphere/cone = leaves
```

No external 3D models are required.

Create a reusable:

```text
Tree
```

component/function.

The exact number of trees is not important.

---

# 19. Visual Style

Use a **clean low-poly architectural visualization style**.

Prioritize:

* clear shapes
* readable layout
* good proportions
* clean colors
* simple materials
* good camera angle

Do NOT prioritize:

* photorealistic textures
* physically accurate materials
* complex shadows
* realistic vegetation
* detailed furniture
* external GLB models

The scene should feel like a **simple digital campus model**.

---

# 20. Camera

Keep the existing camera/control implementation if possible.

The default camera should show:

```text
ROAD
↓
GATE
↓
RECEPTION
↓
U-SHAPED SCHOOL
↓
COURTYARD
```

A slightly elevated perspective view is preferred.

The user should be able to:

* orbit
* zoom
* pan

Do not redesign the camera system if the existing sample already has working controls.

---

# 21. Lighting

Use simple lighting.

At minimum:

* ambient/hemisphere light
* directional light representing the sun

The scene should have enough lighting to distinguish:

* building
* road
* grass
* gate
* courtyard
* windows

Reuse the existing lighting setup if it already works.

---

# 22. Suggested Code Architecture

Do not create one giant scene file.

Organize the new objects into reusable modules.

Suggested conceptual structure:

```text
src/
  scene/
    SchoolCampus
    SchoolBuilding
    BuildingWing
    Reception
    Gate
    Road
    Courtyard
    Tree
    Door
    Window
    Stairs
```

The exact folder structure should follow the existing project's conventions.

The important principle is:

```text
Campus
 ├── Road
 ├── Gate
 ├── Entrance
 ├── Reception
 ├── Building
 │    ├── LeftWing
 │    ├── RightWing
 │    └── RearWing
 ├── Courtyard
 └── Landscaping
```

---

# 23. Data-Driven Layout

Avoid hard-coding every object's position throughout the code.

Create a simple configuration/data structure.

For example conceptually:

```javascript
const campus = {
  road: {...},
  gate: {...},
  reception: {...},
  building: {
    leftWing: {...},
    rightWing: {...},
    rearWing: {...}
  }
}
```

The exact implementation can follow the existing project's language/style.

The purpose is to make it easy later to change:

```text
building width
building depth
road width
gate position
number of floors
```

without rewriting the scene.

---

# 24. Important Separation

Keep these concepts separate:

### Campus data

Defines:

```text
where objects are
what objects are
dimensions
```

### 3D components

Define:

```text
how objects are rendered
```

### UI

Defines:

```text
buttons
menus
labels
information panels
```

Do not mix all three together.

This separation will be important when the project later becomes a real school visualization system.

---

# 25. Initial UI

Do not create a complicated dashboard yet.

Keep the existing UI.

If there is no existing UI, add only a small title:

```text
AL-FALAH SCHOOL
3D CAMPUS
```

Optional:

```text
[ Reset View ]
```

Do not add:

* authentication
* student management
* teacher management
* attendance
* schedules
* database
* analytics dashboard

Those belong to later iterations.

---

# 26. Interaction

For this iteration, interaction can remain minimal.

The user should be able to navigate around the campus using the existing camera controls.

Optional:

* hover highlight
* click building
* click gate
* click reception

If implementing selection, show a simple label such as:

```text
Reception
Main Gate
School Building
Courtyard
```

Do not build the full information system yet.

---

# 27. Performance

The application should remain lightweight.

Avoid:

* unnecessary high-poly geometry
* large textures
* external 3D models
* hundreds of individual complex meshes
* unnecessary post-processing

Prefer:

```text
BoxGeometry
PlaneGeometry
CylinderGeometry
SphereGeometry
```

Use reusable geometry/materials where appropriate.

Do not prematurely optimize unless performance becomes an actual problem.

---

# 28. Development Strategy

Implement this in small stages.

## Stage 1 — Campus Ground

Create:

```text
ground
road
sidewalk
```

Verify camera and lighting.

---

## Stage 2 — Gate

Add:

```text
gate pillars
gate opening
school sign
```

Verify scale and position.

---

## Stage 3 — Reception

Add:

```text
reception
entrance
entrance path
```

Verify the visual relationship:

```text
road → gate → reception
```

---

## Stage 4 — U-Shaped Building

Create:

```text
left wing
right wing
rear wing
```

Verify that the three pieces form a clean U.

The open side must face the entrance.

---

## Stage 5 — Building Details

Add:

```text
floors
windows
doors
stairs
```

Keep them simple.

---

## Stage 6 — Courtyard

Add:

```text
grass
path
trees
```

---

## Stage 7 — Polish

Improve:

* proportions
* spacing
* camera
* lighting
* materials
* labels
* overall composition

Do not add new features during this stage.

---

# 29. Acceptance Criteria

The implementation is complete when:

### Campus

* [ ] Ground exists.
* [ ] Road exists in front of the school.
* [ ] Sidewalk exists.
* [ ] Main gate exists.
* [ ] Gate has two pillars.
* [ ] Gate has a visible opening.
* [ ] School name is visible.

### Entrance

* [ ] Entrance path connects gate to school.
* [ ] Reception is visible from the entrance.
* [ ] Reception has a recognizable entrance.

### Building

* [ ] School building has a U-shaped layout.
* [ ] Left wing exists.
* [ ] Right wing exists.
* [ ] Rear wing connects both sides.
* [ ] Open side of U faces the main entrance.
* [ ] Courtyard exists inside the U.
* [ ] Building has at least two visual floors.
* [ ] Basic windows exist.
* [ ] Basic doors exist.
* [ ] At least one staircase exists.

### Environment

* [ ] Courtyard has grass.
* [ ] Several simple trees exist.
* [ ] Campus is visually understandable.
* [ ] Road, gate, reception and building have clear spatial relationships.

### Navigation

* [ ] Existing orbit controls still work.
* [ ] Zoom works.
* [ ] Pan works.
* [ ] Camera starts at a useful overview position.
* [ ] Existing functionality has not been broken.

### Code

* [ ] Existing project architecture is preserved.
* [ ] No unnecessary framework migration.
* [ ] Components/functions are reusable.
* [ ] Geometry is reasonably modular.
* [ ] Layout values are not scattered throughout the code.
* [ ] Application runs without errors.

---

# 30. Agent Behavior Requirements

The coding agent should behave as an incremental implementation partner.

Before coding:

1. Inspect the repository.
2. Identify the existing Three.js architecture.
3. Explain briefly what will be reused.
4. Identify the files that need modification/addition.

Then implement **Stage 1 only**.

After Stage 1:

1. Run the application.
2. Check for build/runtime errors.
3. Verify the scene.
4. Fix problems.
5. Stop and report what was implemented.

Then proceed to the next stage only after the previous stage is working.

Do not implement the entire campus in one giant change.

---

# 31. First Prompt to the Coding Agent

Use this as the first instruction:

> Read this requirements document and inspect the existing repository before making any changes.
>
> I already have a working Three.js sample application. Do NOT rebuild it and do NOT migrate frameworks.
>
> First, understand the current architecture: scene, camera, renderer, controls, lighting, animation loop, and existing components.
>
> Then implement **Stage 1 only: Campus Ground**.
>
> Add:
>
> * school campus ground
> * road in front of the school
> * simple sidewalk
>
> Use simple Three.js primitives and reuse the existing rendering architecture.
>
> Do not add the gate, reception, U-shaped building, trees, or other features yet.
>
> Keep the code modular and beginner-readable.
>
> After implementation:
>
> 1. Run the application.
> 2. Fix any build/runtime errors.
> 3. Make sure existing functionality still works.
> 4. Give me a short summary of the files changed and what was added.
>
> Do not proceed to Stage 2 until I ask you to.

---

# 32. Next Agent Prompts

After Stage 1 works:

### Stage 2

> Continue with Stage 2 of the requirements.
>
> Add the main school gate with two pillars, gate opening, simple gate structure, and AL-FALAH SCHOOL sign.
>
> Reuse the existing architecture and keep the implementation modular.
>
> Do not modify unrelated functionality.
>
> Run and verify the application before finishing.

### Stage 3

> Continue with Stage 3.
>
> Add the reception/lobby and entrance path connecting the main gate to the reception.
>
> The spatial relationship should clearly communicate:
>
> ROAD → GATE → ENTRANCE PATH → RECEPTION.
>
> Keep everything simple and low-poly.
>
> Run and verify the application.

### Stage 4

> Continue with Stage 4.
>
> Create the main school building as three connected wings forming a U shape:
>
> * left wing
> * right wing
> * rear wing
>
> The open side of the U must face the main entrance.
>
> Make sure the three wings connect cleanly and create a recognizable courtyard.
>
> Do not add detailed classrooms yet.
>
> Run and visually verify the result.

### Stage 5

> Continue with Stage 5.
>
> Add the basic building details:
>
> * two visual floors
> * reusable windows
> * reusable doors
> * simple staircase
>
> Keep the geometry simple and reusable.
>
> Do not introduce external 3D assets.

### Stage 6

> Continue with Stage 6.
>
> Add the courtyard and simple landscaping:
>
> * grass
> * walking path
> * several simple procedural trees
> * optional bushes/benches
>
> Keep the scene lightweight.

### Stage 7

> Continue with Stage 7.
>
> Polish the existing campus without introducing major new features.
>
> Focus on:
>
> * proportions
> * camera position
> * lighting
> * spacing
> * materials
> * visual hierarchy
> * readability of the U-shaped building
>
> Make the campus look like a coherent low-poly architectural visualization.

---

# 33. Future Direction

This iteration establishes the **physical campus layer**.

Future iterations can build on top of it:

```text
                    SCHOOL DIGITAL TWIN
                           │
             ┌─────────────┴─────────────┐
             │                           │
          PHYSICAL                    DATA
          CAMPUS                       MODEL
             │                           │
       ┌─────┴─────┐              ┌─────┴─────┐
       │            │              │           │
    Building     Campus        Classes      Students
       │                           │
    Floors                      Teachers
       │                           │
    Rooms                     Schedules
       │
    Facilities
```

Later features may include:

* classrooms
* room information
* floor selector
* room search
* room highlighting
* camera navigation
* student locations
* teacher locations
* class schedules
* room utilization
* school facility management
* emergency evacuation routes
* navigation
* analytics
* IoT data
* digital twin capabilities

These are **not part of the current implementation**.

The current goal is simply:

> **Build a believable 3D school campus that gives us a strong physical foundation for everything that comes later.**
