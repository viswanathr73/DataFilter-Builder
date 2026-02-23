import React from 'react';

// ── MUI Layout & Surface ────────────────────────────────────────────────────
import AppBar        from '@mui/material/AppBar';
import Toolbar       from '@mui/material/Toolbar';
import Container     from '@mui/material/Container';
import Box           from '@mui/material/Box';
import Typography    from '@mui/material/Typography';
import Chip          from '@mui/material/Chip';

// ── MUI Icons ───────────────────────────────────────────────────────────────
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import CircleIcon          from '@mui/icons-material/Circle';

// ── Custom hooks ────────────────────────────────────────────────────────────
import { useFilters }    from './hooks/useFilter';
import { useSortedData } from './hooks/useSortedData';

// ── Feature components ───────────────────────────────────────────────────────
import FilterBuilder from './components/filters/FilterBuilder';
import EmployeeTable from './components/table/EmployeeTable';

/**
 * App — root component.
 *
 * Responsibilities:
 *   1. Render the sticky AppBar header
 *   2. Call useFilters() to get filter state + filtered data
 *   3. Call useSortedData() to get sorted rows
 *   4. Pass state and handlers down to FilterBuilder and EmployeeTable
 *
 * Data flow (strictly one-way, no prop drilling):
 *
 *   EMPLOYEES (static array)
 *       ↓
 *   useFilters → filteredData     (filter conditions applied)
 *       ↓
 *   useSortedData → sortedData    (sort order applied)
 *       ↓
 *   EmployeeTable                 (renders rows)
 *
 * This component owns NO business logic.
 * All logic lives in hooks (useFilters, useSortedData) and utils (filterEngine).
 */
const App: React.FC = () => {
  // ── Filter state ──────────────────────────────────────────────────────────
  const {
    conditions,
    addCondition,
    updateCondition,
    removeCondition,
    clearAll,
    filteredData,
    totalCount,
    filteredCount,
    activeCount,
  } = useFilters();

  // ── Sort state ────────────────────────────────────────────────────────────
  // useSortedData takes filteredData and returns a sorted copy.
  // It only recalculates (useMemo) when filteredData or sort config changes.
  const { sortedData, sort, toggleSort } = useSortedData(filteredData);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Sticky AppBar header ──────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        component="header"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important' }}>

          {/* Brand icon */}
          <HexagonOutlinedIcon
            sx={{
              color: 'primary.main',
              fontSize: 34,
              mr: 1.5,
            }}
            aria-hidden="true"
          />

          {/* Brand name + subtitle */}
          <Box sx={{ mr: 'auto' }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontFamily: "'Ibarra Real Nova', Georgia, serif",
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'text.primary',
              }}
            >
              DataFilter Pro
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: '0.06em',
                display: 'block',
                lineHeight: 1,
              }}
            >
              Dynamic Employee Directory
            </Typography>
          </Box>

          {/* Dataset status badge */}
          <Chip
            icon={
              <CircleIcon
                sx={{
                  fontSize: '8px !important',
                  color: 'success.main !important',
                  // Glowing green dot to show the dataset is "live"
                  filter: 'drop-shadow(0 0 4px #2dd4a4)',
                }}
                aria-hidden="true"
              />
            }
            label={`${totalCount} employees loaded`}
            variant="outlined"
            size="small"
            role="status"
            aria-label={`${totalCount} employees loaded`}
            sx={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.72rem',
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          />
        </Toolbar>
      </AppBar>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <Box
        component="main"
        id="main-content"
        sx={{ flex: 1, py: 3 }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/*
           * FilterBuilder — top panel
           * Receives:
           *   conditions   → array of FilterCondition objects to render as rows
           *   activeCount  → count of conditions where isValid = true (for badge)
           *   onAdd        → adds a new empty condition row
           *   onUpdate     → updates field/operator/value on a specific condition
           *   onRemove     → removes a condition by id
           *   onClear      → removes all conditions at once
           */}
          <FilterBuilder
            conditions={conditions}
            activeCount={activeCount}
            onAdd={addCondition}
            onUpdate={updateCondition}
            onRemove={removeCondition}
            onClear={clearAll}
          />

          {/*
           * EmployeeTable — bottom panel
           * Receives:
           *   data           → sortedData (already filtered + sorted)
           *   sort           → current sort config { key, dir }
           *   onSort         → called when user clicks a column header
           *   totalCount     → always 55 (shown in stats bar)
           *   filteredCount  → length of filteredData (before sort, same count)
           */}
          <EmployeeTable
            data={sortedData}
            sort={sort}
            onSort={toggleSort}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default App;
