import React from 'react';
import type {
  FilterCondition,
  FilterValue,
  DateRangeValue,
  AmountRangeValue,
  NumberBetweenValue,
} from '../../types';
import { FIELD_DEFINITIONS } from '../../data/fieldDefinitions';

import TextInput         from './TextInput';
import NumberInput       from './NumberInput';
import DateInput         from './DateInput';
import AmountRangeInput  from './AmountRangeInput';
import SingleSelectInput from './SingleSelectInput';
import MultiSelect       from './MultiSelect';
import BooleanInput      from './BooleanInput';

interface DynamicInputProps {
  condition: FilterCondition;
  onValueChange: (value: FilterValue) => void;
}

/**
 * DynamicInput — the orchestration layer between FilterRow and individual inputs.
 *
 * This component never renders any visible UI of its own. It reads the
 * `fieldKey` from the condition, looks up the field's type in FIELD_DEFINITIONS,
 * and delegates rendering to the appropriate input component.
 *
 * Why this exists:
 *   FilterRow does not need to know about every input type.
 *   Each input component does not need to know about conditions or field config.
 *   DynamicInput is the only component that knows both sides.
 *
 * Extensibility:
 *   Adding a new field type = add one case here + create the input component.
 *   Nothing else in the system needs to change.
 */
const DynamicInput: React.FC<DynamicInputProps> = ({ condition, onValueChange }) => {
  // Find the field definition that matches this condition's fieldKey
  const fieldDef = FIELD_DEFINITIONS.find((f) => f.key === condition.fieldKey);

  // Guard: if no matching field found, render nothing
  if (!fieldDef) return null;

  switch (fieldDef.type) {
    // ── Text: name, email, role, city, state ──────────────────────────────
    case 'text':
      return (
        <TextInput
          value={typeof condition.value === 'string' ? condition.value : ''}
          onChange={(v) => onValueChange(v)}
        />
      );

    // ── Number: projects count, performance rating ─────────────────────────
    case 'number':
      return (
        <NumberInput
          value={condition.value as string | NumberBetweenValue}
          operator={condition.operator}
          onChange={(v) => onValueChange(v as FilterValue)}
        />
      );

    // ── Date: joinDate, lastReview ─────────────────────────────────────────
    case 'date':
      return (
        <DateInput
          value={(condition.value as DateRangeValue) ?? { from: '', to: '' }}
          operator={condition.operator}
          onChange={(v) => onValueChange(v)}
        />
      );

    // ── Amount: salary (currency range) ───────────────────────────────────
    case 'amount':
      return (
        <AmountRangeInput
          value={(condition.value as AmountRangeValue) ?? { min: '', max: '' }}
          onChange={(v) => onValueChange(v)}
        />
      );

    // ── Single Select: department, country ────────────────────────────────
    case 'single-select':
      return (
        <SingleSelectInput
          value={typeof condition.value === 'string' ? condition.value : ''}
          options={fieldDef.options ?? []}
          onChange={(v) => onValueChange(v)}
          fieldLabel={fieldDef.label}
        />
      );

    // ── Multi Select: skills ──────────────────────────────────────────────
    case 'multi-select':
      return (
        <MultiSelect
          value={Array.isArray(condition.value) ? condition.value : []}
          options={fieldDef.options ?? []}
          onChange={(v) => onValueChange(v)}
          fieldLabel={fieldDef.label}
        />
      );

    // ── Boolean: isActive ─────────────────────────────────────────────────
    case 'boolean':
      return (
        <BooleanInput
          value={condition.value === true || condition.value === 'true'}
          onChange={(v) => onValueChange(v)}
        />
      );

    default:
      return null;
  }
};

export default DynamicInput;
