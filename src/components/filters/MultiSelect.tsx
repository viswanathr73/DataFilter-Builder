import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface MultiSelectProps {
  value: string[];
  options: string[];
  onChange: (v: string[]) => void;
  fieldLabel?: string;
}

/**
 * MultiSelect — MUI Autocomplete in multiple mode.
 *
 * Used for: Skills field.
 * Operators: "Contains Any", "Contains None", "Contains All".
 *
 * Features:
 * - Checkbox next to each option so users can clearly see what is selected
 * - disableCloseOnSelect keeps the dropdown open while picking multiple items
 * - Selected items render as Chips inside the input with a remove × button
 * - Fully keyboard accessible (built into MUI Autocomplete)
 * - Fuzzy search: typing filters the options list in real time
 *
 * MUI Autocomplete replaces the entire custom MultiSelect dropdown that
 * would otherwise require manual state, click-outside listeners, etc.
 */
const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  options,
  onChange,
  fieldLabel = "options",
}) => (
  <Autocomplete
    multiple
    fullWidth
    size="small"
    options={options}
    value={value}
    disableCloseOnSelect
    onChange={(_, newValue: string[]) => onChange(newValue)}
    // ── Each option row: checkbox + label ────────────────────────────────────
    renderOption={(props, option, { selected }) => (
      <li {...props} key={option}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          style={{ marginRight: 6, padding: 0 }}
          checked={selected}
          size="small"
        />
        {option}
      </li>
    )}
    // ── Selected values shown as Chips inside the input ───────────────────
    renderTags={(selected: string[], getTagProps) =>
      selected.map((opt, index) => (
        <Chip
          label={opt}
          size="small"
          color="primary"
          variant="outlined"
          {...getTagProps({ index })}
          key={opt}
          sx={{ fontSize: "0.68rem" }}
        />
      ))
    }
    // ── The visible text input ────────────────────────────────────────────
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder={value.length === 0 ? `Search ${fieldLabel}…` : ""}
        inputProps={{
          ...params.inputProps,
          "aria-label": `Select ${fieldLabel}`,
        }}
      />
    )}
    // ── Accessibility ─────────────────────────────────────────────────────
    aria-label={`${fieldLabel} multi-select`}
    // Limit visible tags in input to keep the row compact
    limitTags={3}
    getLimitTagsText={(more) => `+${more} more`}
  />
);

export default MultiSelect;
