import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface BooleanInputProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

/**
 * BooleanInput — two-button toggle for boolean fields.
 *
 * Used for: Active Status field.
 * Operator: "is" (only operator available for boolean).
 *
 * MUI ToggleButtonGroup with `exclusive` prop means only one button
 * can be selected at a time (like a radio group).
 *
 * The null guard in onChange prevents deselecting both buttons —
 * a boolean filter always has a value (true or false), never empty.
 *
 * aria-pressed is automatically managed by ToggleButton.
 */
const BooleanInput: React.FC<BooleanInputProps> = ({ value, onChange }) => {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => {
    // Prevent deselection — boolean must always be true or false
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      size="small"
      value={value}
      onChange={handleChange}
      aria-label="Boolean filter value"
    >
      <ToggleButton
        value={true}
        aria-label="Active or true"
        sx={{ gap: 0.5 }}
      >
        <CheckIcon fontSize="small" />
        Active / True
      </ToggleButton>

      <ToggleButton
        value={false}
        aria-label="Inactive or false"
        sx={{ gap: 0.5 }}
      >
        <CloseIcon fontSize="small" />
        Inactive / False
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default BooleanInput;
