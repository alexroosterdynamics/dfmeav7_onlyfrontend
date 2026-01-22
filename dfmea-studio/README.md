# DFMEA Studio (Frontend Mock)

A desktop-first mock UI for a DFMEA/requirements workspace.
This project intentionally focuses on clean layout, minimal code, and scalable state design.

## Tech
- React (JSX)
- TailwindCSS (utility-first styling)
- lucide-react (icons)

## Structure

src/
  App.jsx
  components/
    TopNav.jsx
    Sidebar.jsx
    Workspace.jsx
    RequirementsViewport.jsx
    AiDock.jsx
  contexts/
    DFMEAContext.jsx
  data/
    requirements.json

## State Management

The app uses a small Context + useReducer store (`DFMEAContext.jsx`) to manage:
- navigation (activeTab)
- requirements data (requirementsData)
- workflows (workflows, selectedWorkflowId)

UI-only view preferences (cards/list, sizing, filtering) stay local to components.

## Data Model

`src/data/requirements.json`

- title: string
- meta.visibility: "private" | "shared" | ...
- meta.edited: string (human label)
- tasksTitle: string
- tasks[]: { id, label, done }
- content.projectName: string
- content.requirements[]:
  - id: string
  - text: string
  - domainCategory: string (Software/Electrical/Mechanical/...)
  - reqType: string
  - priority: string
  - ownerRole: string
  - ownerName: string
  - files: string[]
  - isComplete: boolean
  - flagged: boolean
  - aiAdvice: string

## Adding a new screen (tab)

1. Add a new tab id in the store or Sidebar
2. Render it conditionally in Workspace:
   `activeTab === "yourTab" ? <YourComponent/> : null`

Keep screens isolated but use shared app state from context.

## Design goals
- One source of truth
- Minimal props / minimal drilling
- Clear separation of: data state vs UI preferences
- Easy extension without adding libraries
