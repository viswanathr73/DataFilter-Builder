import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FilterCondition, Operator, FilterValue } from '../types';
import { FIELD_DEFINITIONS, getDefaultValue, getDefaultOperator } from '../data/fieldDefinitions';
import { validateCondition, filterEmployees } from '../utils/filterEngine';
import { EMPLOYEES } from '../data/employees';

const STORAGE_KEY = 'dfp_filter_conditions';
let idCounter = 0;
const genId = () => `filter-${Date.now()}-${++idCounter}`;

/**
 * Attempts to rehydrate persisted conditions from localStorage.
 * Falls back to [] if nothing is saved or JSON is corrupted.
 */
function loadPersistedConditions(): FilterCondition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FilterCondition[];
    // Re-validate every condition after hydration (field defs may have changed)
    return parsed.map((c) => ({
      ...c,
      isValid: validateCondition(c),
    }));
  } catch {
    return [];
  }
}

/**
 * Central filter state hook. Owns all conditions, exposes clean mutators,
 * and provides memoized filtered data derived from the EMPLOYEES dataset.
 *
 * Filter logic: AND between different fields, OR within the same field.
 * Conditions that are not yet complete (isValid=false) are skipped silently.
 */
export function useFilters() {
  const [conditions, setConditions] =
    useState<FilterCondition[]>(loadPersistedConditions);

  // ── Persist to localStorage whenever conditions change ──────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions));
    } catch {
      // localStorage may be unavailable (private browsing / quota exceeded)
    }
  }, [conditions]);

  // ── Mutators ────────────────────────────────────────────────────────────────

  const addCondition = useCallback(() => {
    const field = FIELD_DEFINITIONS[0];
    const newCondition: FilterCondition = {
      id:        genId(),
      fieldKey:  field.key,
      operator:  getDefaultOperator(field.type),
      value:     getDefaultValue(field.type),
      isValid:   false,
    };
    setConditions((prev) => [...prev, newCondition]);
  }, []);

  const updateCondition = useCallback(
    (
      id: string,
      changes: Partial<Pick<FilterCondition, 'fieldKey' | 'operator' | 'value'>>
    ) => {
      setConditions((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;

          let updated: FilterCondition = { ...c, ...changes };

          // When field changes → reset operator + value to new field's defaults
          if ('fieldKey' in changes && changes.fieldKey !== c.fieldKey) {
            const newField = FIELD_DEFINITIONS.find(
              (f) => f.key === changes.fieldKey
            );
            if (newField) {
              updated.operator = getDefaultOperator(newField.type);
              updated.value    = getDefaultValue(newField.type);
            }
          }

          // When operator changes for number "between" ↔ single-value:
          // reset value to avoid shape mismatch
          if (
            'operator' in changes &&
            changes.operator !== c.operator
          ) {
            const field = FIELD_DEFINITIONS.find((f) => f.key === updated.fieldKey);
            if (field?.type === 'number') {
              const wasBetween  = c.operator === 'between';
              const nowBetween  = changes.operator === 'between';
              if (wasBetween !== nowBetween) {
                updated.value = getDefaultValue(field.type);
              }
            }
            // Same for date: switching to/from last_30_days needs no value
            if (field?.type === 'date') {
              updated.value = getDefaultValue(field.type);
            }
          }

          updated.isValid = validateCondition(updated);
          return updated;
        })
      );
    },
    []
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setConditions([]);
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────────

  /**
   * filteredData re-runs ONLY when conditions array reference changes.
   * The filterEmployees function itself is O(n × m) — efficient for 50+ records.
   */
  const filteredData = useMemo(
    () => filterEmployees(EMPLOYEES, conditions),
    [conditions]
  );

  const activeCount = useMemo(
    () => conditions.filter((c) => c.isValid).length,
    [conditions]
  );

  return {
    conditions,
    addCondition,
    updateCondition,
    removeCondition,
    clearAll,
    filteredData,
    totalCount:    EMPLOYEES.length,
    filteredCount: filteredData.length,
    activeCount,
  };
}
