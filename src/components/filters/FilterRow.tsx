import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import  Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import type { FilterCondition, Operator, FilterValue } from '../../types';
import { FIELD_DEFINITIONS, getOperatorsForField } from '../../data/fieldDefinitions';
import DynamicInput from './DynamicInput';

interface FilterRowProps {
  condition: FilterCondition;
  index: number;
  onUpdate: (
    id: string,
    changes: Partial<Pick<FilterCondition, 'fieldKey' | 'operator' | 'value'>>
  ) => void;
  onRemove: (id: string) => void;
}

/**
 * FilterRow — one complete filter condition row.
 *
 * Layout (left to right):
 *   [Row #] [Field dropdown] [Operator dropdown] [Dynamic value input] [● dot] [🗑 button]
 *
 * Responsibilities:
 *   - Renders the field selector. When changed, the hook resets operator + value.
 *   - Renders the operator selector. Options change based on field type.
 *   - Renders DynamicInput which picks the right value input component.
 *   - Shows a green dot (●) when isValid = true (filter is active).
 *   - Shows a delete IconButton to remove this condition.
 *
 * The left border turns amber when the condition is valid — gives instant
 * visual feedback that this filter is actively affecting the table results.
 */
const FilterRow: React.FC<FilterRowProps> = ({
  condition,
  index,
  onUpdate,
  onRemove,
}) => {
  // Look up which operators are available for this field's type
  const fieldDef = FIELD_DEFINITIONS.find((f) => f.key === condition.fieldKey);
  const operators = fieldDef ? getOperatorsForField(fieldDef.type) : [];

  // Unique IDs for label association (accessibility)
  const fieldLabelId  = `field-label-${condition.id}`;
  const opLabelId     = `op-label-${condition.id}`;

  return (
    <Paper
      variant="outlined"
      role="group"
      aria-label={`Filter condition ${index + 1}`}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1.5,
        p: 1.5,
        flexWrap: 'wrap',
        bgcolor: 'background.paper',
        // Left border turns amber when condition is complete and active
        borderLeft: condition.isValid
          ? '3px solid #f5a623'
          : '3px solid transparent',
        transition: 'border-left-color 0.2s ease',
      }}
    >
      {/* ── Row number ──────────────────────────────────────────────────── */}
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{
          fontFamily: "'IBM Plex Mono', monospace",
          minWidth: '16px',
          textAlign: 'center',
          pb: 1,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {index + 1}
      </Typography>

      {/* ── Field selector ───────────────────────────────────────────────── */}
      <FormControl size="small" sx={{ minWidth: 160, flexShrink: 0 }}>
        <InputLabel id={fieldLabelId}>Field</InputLabel>
        <Select
          labelId={fieldLabelId}
          label="Field"
          value={condition.fieldKey}
          onChange={(e: SelectChangeEvent) =>
            onUpdate(condition.id, { fieldKey: e.target.value })
          }
          inputProps={{ 'aria-label': 'Select field to filter' }}
        >
          {FIELD_DEFINITIONS.map((f) => (
            <MenuItem key={f.key} value={f.key}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── Operator selector ────────────────────────────────────────────── */}
      <FormControl size="small" sx={{ minWidth: 155, flexShrink: 0 }}>
        <InputLabel id={opLabelId}>Operator</InputLabel>
        <Select
          labelId={opLabelId}
          label="Operator"
          value={condition.operator}
          onChange={(e: SelectChangeEvent) =>
            onUpdate(condition.id, { operator: e.target.value as Operator })
          }
          inputProps={{ 'aria-label': 'Select filter operator' }}
        >
          {operators.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── Dynamic value input ──────────────────────────────────────────── */}
      <Box
        sx={{ flex: 1, minWidth: 220 }}
        role="group"
        aria-label="Filter value"
      >
        {/* Small "Value" label above the input for visual clarity */}
        <Typography
          variant="overline"
          color="text.disabled"
          display="block"
          sx={{ mb: 0.5, lineHeight: 1 }}
        >
          Value
        </Typography>
        <DynamicInput
          condition={condition}
          onValueChange={(v: FilterValue) =>
            onUpdate(condition.id, { value: v })
          }
        />
      </Box>

      {/* ── Validity dot ─────────────────────────────────────────────────── */}
      <Tooltip
        title={condition.isValid ? 'Filter is active' : 'Fill in a value to activate'}
        placement="top"
      >
        <FiberManualRecordIcon
          role="status"
          aria-label={condition.isValid ? 'Filter active' : 'Filter incomplete'}
          sx={{
            fontSize: 10,
            mb: 1.2,
            flexShrink: 0,
            color: condition.isValid ? 'success.main' : 'action.disabled',
            // Glow effect when active
            filter: condition.isValid
              ? 'drop-shadow(0 0 4px #2dd4a4)'
              : 'none',
            transition: 'color 0.2s ease, filter 0.2s ease',
          }}
        />
      </Tooltip>

      {/* ── Remove button ────────────────────────────────────────────────── */}
      <Tooltip title="Remove this filter" placement="top">
        <IconButton
          size="small"
          onClick={() => onRemove(condition.id)}
          aria-label={`Remove filter condition ${index + 1}`}
          sx={{
            mb: 0.5,
            flexShrink: 0,
            color: 'text.disabled',
            '&:hover': {
              color: 'error.main',
              bgcolor: 'rgba(240,90,90,0.08)',
            },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default FilterRow;
