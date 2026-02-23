# DataFilter builder — Dynamic Employee Filter System

A production-grade, type-safe dynamic filter component system built with **React 18 + TypeScript + Vite**.

## Live Demo
>  Vercel link: 

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run type-check # run tsc without emitting
```

---

## Project Structure

```
src/
├── types/
│   └── index.ts                 # All TS interfaces (Employee, FilterCondition, etc.)
├── data/
│   ├── employees.ts             # 55 sample employee records
│   └── fieldDefinitions.ts     # Field config, operator maps, default values
├── utils/
│   └── filterEngine.ts         # Pure filtering algorithms + CSV export
|
|___ theme/
│   └── index.ts.ts             # MUI  global theme
|
|
|
├── hooks/
│   ├── useFilters.ts            # Filter state + localStorage persistence
│   └── useSortedData.ts        # Sort state management
└── components/
    ├── filters/
    │   ├── FilterBuilder.tsx    # Top-level filter panel
    │   ├── FilterRow.tsx        # One condition: field → operator → value
    │   ├── DynamicInput.tsx     # Orchestrates which input to render
    │   ├── TextInput.tsx        # Debounced text input
    │   ├── NumberInput.tsx      # Single value + "between" range mode
    │   ├── DateInput.tsx        # between / before / after / last_30_days
    │   ├── AmountRangeInput.tsx # Currency min–max range
    │   ├── SingleSelectInput.tsx# Dropdown select
    │   ├── MultiSelect.tsx      # Checkbox dropdown with tags
    │   └── BooleanInput.tsx     # Active/Inactive toggle
    └── table/
        └── EmployeeTable.tsx    # Sortable table + CSV export button
```

---

## Supported Filter Types & Operators

| Field Type      | Operators                                                        |
|-----------------|------------------------------------------------------------------|
| **Text**        | Contains, Equals, Starts With, Ends With, Does Not Contain       |
| **Number**      | Equals, Not Equal, >, <, ≥, ≤, Between                          |
| **Date**        | Between, Before, After, Last 30 Days                             |
| **Amount**      | Between (min–max currency range)                                  |
| **Single Select** | Is, Is Not                                                     |
| **Multi Select** | Contains Any (in), Contains None (not_in), Contains All          |
| **Boolean**     | Is (true/false toggle)                                            |

---

## Filterable Fields

| Field              | Type           | Notes                        |
|--------------------|----------------|------------------------------|
| Name               | text           |                              |
| Email              | text           |                              |
| Department         | single-select  | 8 departments                |
| Role               | text           |                              |
| Salary             | amount         | Currency range               |
| Join Date          | date           | All 4 date operators         |
| Last Review        | date           | All 4 date operators         |
| Active Status      | boolean        |                              |
| Skills             | multi-select   | 20 skills, all 3 operators   |
| City               | text           | Dot-notation: address.city   |
| State              | text           | Dot-notation: address.state  |
| Country            | single-select  | 6 countries                  |
| Projects Count     | number         | All 7 operators              |
| Performance Rating | number         | All 7 operators              |

---

## Filter Logic

- **AND** between conditions on different fields
- **OR** within conditions on the same field

Example: `Department = Engineering OR Design` **AND** `Salary > $80,000` **AND** `Skills contains React`

---

## Architecture Decisions

### TypeScript-First
All data shapes, prop interfaces, and state are strictly typed. The `FilterValue` discriminated union and `FieldType` exhaustive switch ensure type safety at every boundary. No `any` usage in core logic.

### Separation of Concerns
| Layer      | Responsibility                                        |
|------------|-------------------------------------------------------|
| `types/`   | Shared contracts — imported by all other layers       |
| `data/`    | Static config + dataset — no logic                    |
| `utils/`   | Pure functions — no React, no side effects            |
| `hooks/`   | React state + side effects — no UI                    |
| `components/` | UI only — reads from hooks, calls handlers         |

### Performance
- `filterEmployees` wrapped in `useMemo` — only recalculates when `conditions` changes
- `sortedData` in `useMemo` — only recalculates when filter result or sort config changes
- `useCallback` on all event handlers to stabilize references
- `TextInput` uses 300ms debounce to avoid per-keystroke filter recalculations
- `COLS` defined outside the component to prevent recreation on every render

### Extensibility
Adding a new field type requires exactly **4 changes**:
1. Add type to `FieldType` union in `types/index.ts`
2. Add operators to `OPERATORS_BY_TYPE` in `fieldDefinitions.ts`
3. Add a case to `filterEngine.ts` `testCondition` switch
4. Add a case to `DynamicInput.tsx` switch + create the input component

---

## Bonus Features

| Feature             | Implementation                                   |
|---------------------|--------------------------------------------------|
| Filter persistence  | `localStorage` via `useEffect` in `useFilters`  |
| CSV export          | `exportToCSV()` in `filterEngine.ts`             |
| Last 30 days filter | Date operator using `Date.setDate(d - 30)`       |
| Debounced text      | 300ms debounce in `TextInput` via `useRef`       |
| Accessibility       | `aria-label`, `aria-sort`, `aria-pressed`, roles |
| Responsive layout   | CSS flex-wrap on filter rows for mobile          |
| Skip link           | `#main-content` anchor in `index.html`           |

---

## Dataset

55 employees with:
- 8 departments across 6 countries (USA, Canada, UK, Germany, Australia, India)
- Salaries from $58k to $175k
- Performance ratings from 3.4 to 5.0
- Skills arrays (0 to 7 skills) covering 20 distinct technologies
- Mix of active/inactive employees (5 inactive)
- Nested `address` object with `city`, `state`, `country`

---

## Component Usage Example

```tsx
// Using FilterBuilder standalone
import { FilterBuilder } from './components/filters/FilterBuilder';
import { useFilters } from './hooks/useFilters';

function MyPage() {
  const { conditions, addCondition, updateCondition,
          removeCondition, clearAll, filteredData, activeCount } = useFilters();

  return (
    <>
      <FilterBuilder
        conditions={conditions}
        activeCount={activeCount}
        onAdd={addCondition}
        onUpdate={updateCondition}
        onRemove={removeCondition}
        onClear={clearAll}
      />
      <pre>{JSON.stringify(filteredData, null, 2)}</pre>
    </>
  );
}
```
