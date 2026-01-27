# DFMEA Studio (Frontend Mock)

A minimal **desktop-only** DFMEA-style workspace UI built with **React** + **Tailwind**. It’s a pure frontend mock with in-memory state (no backend), focused on:

* **Requirements** viewport (cards + list)
* **Tasks** viewport (list + timeline)
* **Sidebar navigation**
* **AI dock** (mock chat)
* **Workflows** (placeholder, in-memory)

---

## Tech Stack

* React
* Tailwind CSS (utility classes in components)
* lucide-react icons
* No router (navigation is state-driven)
* No API layer (data lives in `/src/data/*.json` and gets copied into React state)

---

## How the App Renders

**Entry point**: `src/App.jsx`

* Wraps everything in `DFMEAProvider`
* Shows a "Desktop required" screen on small sizes
* On desktop:

  * `TopNav`
  * `Sidebar`
  * `Workspace`

```txt
App
 ├─ DFMEAProvider (global state)
 ├─ TopNav (tabs + search)
 └─ Layout
     ├─ Sidebar (nav + workflows + task preview)
     └─ Workspace
         ├─ RequirementsViewport OR TasksViewport
         └─ AiDock
```

---

## Global State (DFMEAContext)

File: `src/contexts/DFMEAContext.jsx`

This is your **single source of truth**.

### State stored in context

* `activeTab` (string): current “page”
* `requirementsData` (from `requirements.json`)
* `tasksData` (from `tasks.json`)
* `workflows` (array, placeholder)
* `selectedWorkflowId` (string|null)

### Mutations / actions exposed

#### Requirements

* `updateRequirement(id, patch)`

#### Tasks (CRUD)

* `replaceTasks(nextTasks)`
* `createTask(task)`
* `updateTask(id, patch)`
* `deleteTask(id)`

#### Workflows (placeholder)

* `createWorkflow()`
* `deleteWorkflow(id)`

> ✅ Everything is **in-memory**. Refreshing the page resets state to JSON defaults.

---

## Data Files

### Requirements

File: `src/data/requirements.json`

Shape:

* `tabId`, `title`, `meta`
* `content.projectName`
* `content.requirements[]`

A requirement object looks like:

```json
{
  "id": "REQ-001",
  "text": "...",
  "domainCategory": "Software|Electrical|Mechanical",
  "reqType": "Functional|Non-functional",
  "priority": "High|Medium|Low",
  "ownerRole": "...",
  "ownerName": "...",
  "isComplete": true,
  "flagged": false,
  "files": []
}
```

### Tasks

File: `src/data/tasks.json`

Shape:

* `tabId`, `title`, `meta`, `project`
* `range { start, end }`
* `lanes[]`
* `milestones[]`
* `tasks[]`

A task object looks like:

```json
{
  "id": "T1",
  "title": "Review reqs",
  "status": "todo|active|blocked|done",
  "priority": "High|Med|Low",
  "owner": "Alice",
  "start": "2026-01-20",
  "end": "2026-01-25",
  "progress": 60,
  "lane": "elec"
}
```

---

## Hooks

### Navigation

File: `src/hooks/useAppNavigation.js`

A tiny wrapper over context:

* `activeTab`
* `setActiveTab(tab)`

### Requirements

File: `src/hooks/useRequirements.js`

Provides:

* `requirements`, `projectName`, `meta`
* `stats` (frozen/flagged counts)
* `frozen(r)` helper
* `updateRequirement()` action

### Requirement grouping

File: `src/hooks/useRequirementGrouping.js`

Groups requirements by `domainCategory` into buckets:

* sorts buckets
* applies filter: `all | frozen | unfrozen`

### Tasks

File: `src/hooks/useTasks.js`

Provides:

* `tasks`, `lanes`, `milestones`, `range`, `project`, `meta`
* `stats` (done/blocked/active)
* CRUD actions from context:

  * `createTask`, `updateTask`, `deleteTask`, `replaceTasks`

### Task filtering

File: `src/hooks/useTaskFiltering.js`

Filters by:

* search query (`q`)
* status filter (`statusFilter`)

### Timeline layout

File: `src/hooks/useTimelineLayout.js`

Computes:

* `dayCount`, `timelineWidth`
* `getLeft(date)`, `getWidth(start,end)`
* `lanesPacked` = tasks packed into rows per lane

### Dock padding helper

File: `src/hooks/useDockHeightPadding.js`

Uses `ResizeObserver` to measure the AI dock height and add bottom padding so it doesn’t cover content.

---

## UI Components

### TopNav

File: `src/components/TopNav.jsx`

* Displays two buttons: Requirements / Tasks
* Uses `setActiveTab("requirements" | "tasks")`

### Sidebar

File: `src/components/Sidebar.jsx`

* Minimal navigation items
* Workflows accordion
* Task preview (top 3)

### Workspace

File: `src/components/Workspace.jsx`

* Reads `activeTab`
* Renders:

  * `RequirementsViewport` when `activeTab !== "tasks"`
  * `TasksViewport` when `activeTab === "tasks"`
* Always shows `AiDock` pinned at the bottom

### RequirementsViewport

File: `src/components/RequirementsViewport.jsx`

* Two view modes: cards / list
* Three filters: all / unfrozen / frozen
* Grouped by domain category

### TasksViewport

File: `src/components/TasksViewport.jsx`

* Search + status filter
* 4 layout modes: timeline / split / list / full
* Timeline is lane-based with packed rows

### AiDock

File: `src/components/AiDock.jsx`

* Mock chat UI (no real API)
* “Full” modal toggle

---

## Adding a New View (besides Tasks + Requirements)

Your app doesn’t use routing. “Views” are just **new `activeTab` values**.

Example: add a **"Insights"** view.

### 1) Create a viewport component

Create `src/components/InsightsViewport.jsx`:

* Keep it minimal
* Use hooks if you have data

### 2) Render it in Workspace

Update `src/components/Workspace.jsx`:

* Replace the current binary `isTasks` logic
* Switch on `activeTab`

Example pattern:

* `requirements` → `RequirementsViewport`
* `tasks` → `TasksViewport`
* `insights` → `InsightsViewport`

### 3) Add a button in TopNav

Update `src/components/TopNav.jsx`:

* Add a third button:

  * `setActiveTab("insights")`

### 4) Add an item in Sidebar

Update `src/components/Sidebar.jsx`:

* Add another `Item` that calls `setActiveTab("insights")`

### 5) (Optional) Add data + hook

If the view needs its own dataset:

* Add `src/data/insights.json`
* Add state to `DFMEAContext`:

  * `insightsData`, `setInsightsData`
* Add `src/hooks/useInsights.js` to read it

---

## Where to Put CRUD

Your current pattern:

* All write operations live in **DFMEAContext**
* Hooks (`useTasks`, `useRequirements`) simply expose those actions

✅ Keep that pattern.

Suggested future upgrade:

* Keep UI calling `createTask/updateTask/deleteTask`
* Swap context internals to call an API later
* Add optimistic updates + persistence

---b

## Future Extensions

Good next upgrades:

* Persist state to `localStorage`
* Add keyboard shortcuts
* Add “selected task” details panel
* Allow drag + resize on timeline bars
* Add workflow execution model (placeholder hooks already exist)

---

## File Map

```txt
src/
  App.jsx
  components/
    AiDock.jsx
    RequirementsViewport.jsx
    Sidebar.jsx
    TasksViewport.jsx
    TopNav.jsx
    Workspace.jsx
  contexts/
    DFMEAContext.jsx
  data/
    requirements.json
    tasks.json
  hooks/
    useAppNavigation.js
    useDockHeightPadding.js
    useRequirementGrouping.js
    useRequirements.js
    useTaskFiltering.js
    useTasks.js
    useTimelineLayout.js
    useWorkflows.js
```
