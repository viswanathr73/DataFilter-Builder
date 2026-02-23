import type {
  Employee,
  FilterCondition,
  FilterValue,
  DateRangeValue,
  AmountRangeValue,
  NumberBetweenValue,
} from "../types";
import { FIELD_DEFINITIONS } from "../data/fieldDefinitions";

//  Helpers
/**
 * Resolves a dot-notation key against a plain object.
 * e.g. getNestedValue(emp, "address.city") → "San Francisco"
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  key: string,
): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc !== null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/** Type guard: DateRangeValue */
function isDateRange(v: FilterValue): v is DateRangeValue {
  return (
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    "from" in (v as object)
  );
}

/** Type guard: AmountRangeValue / NumberBetweenValue (both have min+max) */
function isRangeValue(
  v: FilterValue,
): v is AmountRangeValue | NumberBetweenValue {
  return (
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    "min" in (v as object)
  );
}

/** Returns true only if d is a real, non-NaN Date */
function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

//  Validation

/**
 * Determines whether a FilterCondition has enough data to be applied.
 * Invalid conditions are skipped by the engine without affecting results.
 */
export function validateCondition(
  condition: Omit<FilterCondition, "isValid">,
): boolean {
  const field = FIELD_DEFINITIONS.find((f) => f.key === condition.fieldKey);
  if (!field) return false;

  const { value, operator } = condition;

  switch (field.type) {
    case "text":
      return typeof value === "string" && value.trim() !== "";

    case "number": {
      if (operator === "between") {
        return isRangeValue(value) && (value.min !== "" || value.max !== "");
      }
      return value !== null && value !== "" && !isNaN(Number(value));
    }

    case "date": {
      // "last_30_days" needs no value input
      if (operator === "last_30_days") return true;
      if (!isDateRange(value)) return false;
      if (operator === "before" || operator === "after")
        return value.from !== "";
      return value.from !== "" || value.to !== "";
    }

    case "amount":
      return isRangeValue(value) && (value.min !== "" || value.max !== "");

    case "single-select":
      return typeof value === "string" && value !== "";

    case "multi-select":
      return Array.isArray(value) && value.length > 0;

    case "boolean":
      return true; // boolean always has a value (true/false)

    default:
      return false;
  }
}

//  Single-condition tester

/**
 * Tests ONE FilterCondition against ONE Employee record.
 * Returns true if the employee passes the condition.
 */
function testCondition(
  employee: Employee,
  condition: FilterCondition,
): boolean {
  const field = FIELD_DEFINITIONS.find((f) => f.key === condition.fieldKey);
  if (!field) return true;

  const raw = getNestedValue(
    employee as unknown as Record<string, unknown>,
    condition.fieldKey,
  );

  // Null / undefined field values never match any condition
  if (raw === undefined || raw === null) return false;

  const { operator, value } = condition;

  switch (field.type) {
    //  Text
    case "text": {
      const haystack = String(raw).toLowerCase();
      const needle = String(value ?? "").toLowerCase();
      switch (operator) {
        case "equals":
          return haystack === needle;
        case "contains":
          return haystack.includes(needle);
        case "starts_with":
          return haystack.startsWith(needle);
        case "ends_with":
          return haystack.endsWith(needle);
        case "not_contains":
          return !haystack.includes(needle);
        default:
          return true;
      }
    }

    // Number
    case "number": {
      const n = Number(raw);
      if (operator === "between") {
        if (!isRangeValue(value)) return true;
        const min = value.min !== "" ? Number(value.min) : null;
        const max = value.max !== "" ? Number(value.max) : null;
        if (min !== null && !isNaN(min) && n < min) return false;
        if (max !== null && !isNaN(max) && n > max) return false;
        return true;
      }
      const fv = Number(value);
      if (isNaN(fv)) return true;
      switch (operator) {
        case "equals":
          return n === fv;
        case "not_equals":
          return n !== fv;
        case "gt":
          return n > fv;
        case "lt":
          return n < fv;
        case "gte":
          return n >= fv;
        case "lte":
          return n <= fv;
        default:
          return true;
      }
    }

    //  Date
    case "date": {
      const d = new Date(raw as string);
      // Guard: skip invalid dates in the dataset
      if (!isValidDate(d)) return false;

      if (operator === "last_30_days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        return d >= cutoff;
      }

      if (!isDateRange(value)) return true;

      // "before" uses the "from" slot as the threshold date
      if (operator === "before") {
        if (value.from === "") return true;
        const threshold = new Date(value.from);
        return isValidDate(threshold) && d < threshold;
      }

      // "after" uses the "from" slot as the threshold date
      if (operator === "after") {
        if (value.from === "") return true;
        const threshold = new Date(value.from);
        return isValidDate(threshold) && d > threshold;
      }

      // "between"
      const from = value.from ? new Date(value.from) : null;
      const to = value.to ? new Date(value.to) : null;
      if (from && isValidDate(from) && d < from) return false;
      if (to && isValidDate(to) && d > to) return false;
      return true;
    }

    //  Amount / currency
    case "amount": {
      if (!isRangeValue(value)) return true;
      const n = Number(raw);
      const min = value.min !== "" ? Number(value.min) : null;
      const max = value.max !== "" ? Number(value.max) : null;
      if (min !== null && !isNaN(min) && n < min) return false;
      if (max !== null && !isNaN(max) && n > max) return false;
      return true;
    }

    //  Single-select
    case "single-select": {
      const s = String(raw).toLowerCase();
      const fv = String(value ?? "").toLowerCase();
      switch (operator) {
        case "is":
          return s === fv;
        case "is_not":
          return s !== fv;
        default:
          return true;
      }
    }

    //  Multi-select (array field)
    case "multi-select": {
      const arr = Array.isArray(raw)
        ? raw.map((x) => String(x).toLowerCase())
        : [];
      const selected = Array.isArray(value)
        ? value.map((x) => String(x).toLowerCase())
        : [];
      if (selected.length === 0) return true;
      switch (operator) {
        case "in":
          return selected.some((s) => arr.includes(s)); // any match
        case "not_in":
          return selected.every((s) => !arr.includes(s)); // none match
        case "contains_all":
          return selected.every((s) => arr.includes(s)); // all match
        default:
          return true;
      }
    }

    //  Boolean
    case "boolean": {
      const actual = Boolean(raw);
      const expected = value === true || value === "true";
      return actual === expected;
    }
  }

  return true;
}

// ─── Main filter function ─────────────────────────────────────────────────────

/**
 * Applies a list of FilterConditions to the employee dataset.
 *
 * Logic:
 *  - AND between conditions on DIFFERENT fields (all field groups must pass)
 *  - OR  between conditions on the SAME field  (at least one must pass)
 *
 * Conditions that fail `isValid` are silently skipped.
 *
 * Performance: O(n × m) where n = employees, m = unique fields with conditions.
 * useMemo at the call site ensures this only runs when conditions change.
 */
export function filterEmployees(
  employees: Employee[],
  conditions: FilterCondition[],
): Employee[] {
  const validConditions = conditions.filter((c) => c.isValid);
  if (validConditions.length === 0) return employees;

  // Group by field key for AND/OR logic
  const byField = new Map<string, FilterCondition[]>();
  for (const cond of validConditions) {
    const group = byField.get(cond.fieldKey) ?? [];
    group.push(cond);
    byField.set(cond.fieldKey, group);
  }

  return employees.filter((emp) => {
    // Every field group must pass (AND)
    for (const [, group] of byField) {
      // At least one condition in the group must pass (OR)
      const passes = group.some((c) => testCondition(emp, c));
      if (!passes) return false;
    }
    return true;
  });
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

/**
 * Converts the filtered employee array to a CSV string and triggers download.
 */
export function exportToCSV(
  employees: Employee[],
  filename = "employees.csv",
): void {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Department",
    "Role",
    "Salary",
    "Join Date",
    "Active",
    "Skills",
    "City",
    "State",
    "Country",
    "Projects",
    "Last Review",
    "Performance Rating",
  ];

  const escape = (v: string) =>
    v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;

  const rows = employees.map((e) => [
    e.id,
    escape(e.name),
    escape(e.email),
    escape(e.department),
    escape(e.role),
    e.salary,
    e.joinDate,
    e.isActive ? "Yes" : "No",
    escape(e.skills.join("; ")),
    escape(e.address.city),
    escape(e.address.state),
    escape(e.address.country),
    e.projects,
    e.lastReview,
    e.performanceRating,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
