import React, { useRef } from "react";
import TextField from "@mui/material/TextField";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * TextInput — debounced text field.
 *
 * Uses defaultValue (uncontrolled) so the input feels instant while typing.
 * The actual onChange fires 300ms after the user stops typing, preventing
 * filterEmployees() from running on every single keystroke.
 */
const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "Enter value…",
  debounceMs = 300,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), debounceMs);
  };

  return (
    <TextField
      fullWidth
      size="small"
      defaultValue={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputProps={{ "aria-label": "Filter text value" }}
    />
  );
};

export default TextInput;
