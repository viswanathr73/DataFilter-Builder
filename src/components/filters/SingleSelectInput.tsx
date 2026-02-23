import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface SingleSelectInputProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  fieldLabel?: string;
}

/**
 * SingleSelectInput — MUI dropdown for single-value select fields.
 *
 * Used for: Department, Country.
 * Operators: "is" and "is not".
 *
 * The empty first option lets users see the placeholder before selecting.
 * FormControl + InputLabel gives us the floating label behaviour that MUI
 * Select expects to render correctly.
 */
const SingleSelectInput: React.FC<SingleSelectInputProps> = ({
  value,
  options,
  onChange,
  fieldLabel = "option",
}) => {
  const labelId = `single-select-label-${fieldLabel.replace(/\s/g, "-").toLowerCase()}`;

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>Choose {fieldLabel}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={`Choose ${fieldLabel}`}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
        inputProps={{ "aria-label": `Select ${fieldLabel}` }}
      >
        <MenuItem value="">
          <em style={{ color: "#6b7399", fontStyle: "normal" }}>
            Select {fieldLabel}…
          </em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SingleSelectInput;
