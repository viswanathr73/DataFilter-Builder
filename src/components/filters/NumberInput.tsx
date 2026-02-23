import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NumberBetweenValue } from '../../types';

interface NumberInputProps {
  value: string | NumberBetweenValue;
  operator: string;
  onChange: (v: string | NumberBetweenValue) => void;
}

/**
 * NumberInput — adapts based on the selected operator.
 *
 * - Most operators (equals, gt, lt…) → single number TextField
 * - "between" operator              → two TextFields (min and max) side by side
 *
 * The shape of `value` changes between a plain string and { min, max } object
 * depending on the operator. The hook handles resetting the value when the
 * operator switches between these two modes.
 */
const NumberInput: React.FC<NumberInputProps> = ({ value, operator, onChange }) => {
  // ── Between mode: dual inputs ─────────────────────────────────────────────
  if (operator === 'between') {
    const range: NumberBetweenValue =
      typeof value === 'object' && value !== null && 'min' in value
        ? (value as NumberBetweenValue)
        : { min: '', max: '' };

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Min"
          value={range.min}
          onChange={(e) => onChange({ ...range, min: e.target.value })}
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'aria-label': 'Minimum number value' }}
        />
        <Typography color="text.disabled" sx={{ flexShrink: 0 }}>
          –
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Max"
          value={range.max}
          onChange={(e) => onChange({ ...range, max: e.target.value })}
          placeholder="∞"
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'aria-label': 'Maximum number value' }}
        />
      </Box>
    );
  }

  // ── Single value mode ─────────────────────────────────────────────────────
  return (
    <TextField
      fullWidth
      size="small"
      type="number"
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter number…"
      inputProps={{ 'aria-label': 'Filter number value' }}
    />
  );
};

export default NumberInput;
