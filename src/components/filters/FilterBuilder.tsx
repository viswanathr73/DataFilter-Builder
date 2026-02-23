import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TuneIcon from "@mui/icons-material/Tune";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import AddIcon from "@mui/icons-material/Add";
import InboxIcon from "@mui/icons-material/Inbox";

import type { FilterCondition } from "../../types";
import FilterRow from "./FilterRow";

interface FilterBuilderProps {
  conditions: FilterCondition[];
  activeCount: number;
  onAdd: () => void;
  onUpdate: (
    id: string,
    changes: Partial<Pick<FilterCondition, "fieldKey" | "operator" | "value">>,
  ) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

/**
 * FilterBuilder — the top-level filter panel.
 *  * Responsibilities:
 *   - Renders the panel chrome (Paper, header, divider)
 *   - Shows the "N active" Chip badge when conditions are valid
 *   - "Add Filter" button calls onAdd (adds a new empty FilterRow)
 *   - "Clear All" button calls onClear (removes all conditions)
 *   - Renders empty state when no conditions exist
 *   - Maps conditions → FilterRow components
 * This component owns NO state. All state lives in useFilters hook.
 */
const FilterBuilder: React.FC<FilterBuilderProps> = ({
  conditions,
  activeCount,
  onAdd,
  onUpdate,
  onRemove,
  onClear,
}) => (
  <Paper
    variant="outlined"
    component="section"
    aria-label="Filter builder"
    sx={{ overflow: "hidden" }}
  >
    {/* ── Header ──────────────────────────────────────────────────────────── */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        bgcolor: "#1e2332",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {/* Title + active badge */}
      <Box display="flex" alignItems="center" gap={1}>
        <TuneIcon
          sx={{ color: "primary.main", fontSize: 18 }}
          aria-hidden="true"
        />
        <Typography fontWeight={600} fontSize="0.88rem">
          Filter Conditions
        </Typography>
        {activeCount > 0 && (
          <Chip
            label={`${activeCount} active`}
            size="small"
            color="primary"
            variant="outlined"
            aria-label={`${activeCount} active filter${activeCount > 1 ? "s" : ""}`}
            sx={{ fontSize: "0.68rem" }}
          />
        )}
      </Box>

      {/* Action buttons */}
      <Box display="flex" alignItems="center" gap={1}>
        {conditions.length > 0 && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<FilterListOffIcon fontSize="small" />}
            onClick={onClear}
            aria-label="Clear all filter conditions"
          >
            Clear All
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AddIcon fontSize="small" />}
          onClick={onAdd}
          aria-label="Add new filter condition"
        >
          Add Filter
        </Button>
      </Box>
    </Box>

    <Divider />

    {/* ── Body: empty state or list of filter rows ─────────────────────────── */}
    {conditions.length === 0 ? (
      /* Empty state */
      <Box
        sx={{ py: 2, px: 3, textAlign: "center" }}
        role="status"
        aria-label="No filters applied"
      >
        <InboxIcon
          sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
          aria-hidden="true"
        />
        <Typography color="text.secondary" fontSize="0.875rem">
          No filters applied. Click{" "}
          <Typography
            component="strong"
            color="primary.main"
            fontWeight={600}
            fontSize="inherit"
          >
            Add Filter
          </Typography>{" "}
          to get started.
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          display="block"
          mt={0.75}
          sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          AND logic between different fields · OR logic within the same field
        </Typography>
      </Box>
    ) : (
      /* Filter rows list */
      <Box
        sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}
        role="list"
        aria-label="Filter conditions"
      >
        {conditions.map((condition, index) => (
          <Box key={condition.id} role="listitem">
            <FilterRow
              condition={condition}
              index={index}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          </Box>
        ))}
      </Box>
    )}
  </Paper>
);

export default FilterBuilder;
