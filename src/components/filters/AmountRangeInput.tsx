import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import type { AmountRangeValue } from '../../types';

interface AmountRangeInputProps {
  value: AmountRangeValue;
  onChange: (v: AmountRangeValue) => void;
}

/**
 * AmountRangeInput — dual number inputs for currency range filtering.
 *
 * Used exclusively for the "salary" field.
 * Shows a "$" prefix adornment on both inputs so the user knows
 * they are entering currency values.
 *
 * Both min and max are optional — the filter engine skips whichever
 * bound is left empty, so you can do "salary > $80k" by filling only min.
 */
const AmountRangeInput: React.FC<AmountRangeInputProps> = ({ value, onChange }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    role="group"
    aria-label="Salary range"
  >
    <TextField
      fullWidth
      size="small"
      type="number"
      label="Min"
      value={value.min}
      onChange={(e) => onChange({ ...value, min: e.target.value })}
      placeholder="0"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="caption" color="text.secondary">
              $
            </Typography>
          </InputAdornment>
        ),
      }}
      inputProps={{ 'aria-label': 'Minimum salary' }}
    />
    <Typography color="text.disabled" sx={{ flexShrink: 0 }}>
      –
    </Typography>
    <TextField
      fullWidth
      size="small"
      type="number"
      label="Max"
      value={value.max}
      onChange={(e) => onChange({ ...value, max: e.target.value })}
      placeholder="∞"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="caption" color="text.secondary">
              $
            </Typography>
          </InputAdornment>
        ),
      }}
      inputProps={{ 'aria-label': 'Maximum salary' }}
    />
  </Box>
);

export default AmountRangeInput;
