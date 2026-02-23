import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { DateRangeValue } from '../../types';

interface DateInputProps {
  value: DateRangeValue;
  operator: string;
  onChange: (v: DateRangeValue) => void;
}

/**
 * DateInput — renders different UI for each date operator.
 *
 * Operator → UI:
 *   "between"      → two date pickers (From + To)
 *   "before"       → one date picker labelled "Before date"
 *   "after"        → one date picker labelled "After date"
 *   "last_30_days" → informational chip, no user input needed
 *
 * Both "before" and "after" reuse the `value.from` slot as their threshold date.
 * This keeps the value shape consistent (always DateRangeValue) regardless of operator.
 */
const DateInput: React.FC<DateInputProps> = ({ value, operator, onChange }) => {
  // ── Last 30 days: no input needed ─────────────────────────────────────────
  if (operator === 'last_30_days') {
    return (
      <Chip
        icon={<CalendarMonthIcon sx={{ fontSize: '14px !important' }} />}
        label="Last 30 days (calculated automatically)"
        color="primary"
        variant="outlined"
        size="small"
        sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem' }}
        role="status"
        aria-label="Last 30 days filter is active"
      />
    );
  }

  // ── Before / After: single date picker ────────────────────────────────────
  if (operator === 'before' || operator === 'after') {
    return (
      <TextField
        fullWidth
        size="small"
        type="date"
        label={operator === 'before' ? 'Before date' : 'After date'}
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          'aria-label': operator === 'before' ? 'Before date' : 'After date',
        }}
      />
    );
  }

  // ── Between: two date pickers ─────────────────────────────────────────────
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      role="group"
      aria-label="Date range"
    >
      <TextField
        fullWidth
        size="small"
        type="date"
        label="From"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ 'aria-label': 'From date' }}
      />
      <Typography color="text.disabled" sx={{ flexShrink: 0 }}>
        –
      </Typography>
      <TextField
        fullWidth
        size="small"
        type="date"
        label="To"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ 'aria-label': 'To date' }}
      />
    </Box>
  );
};

export default DateInput;
