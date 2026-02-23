// Domain Types 

export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO date string "YYYY-MM-DD"
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string; // ISO date string "YYYY-MM-DD"
  performanceRating: number;
}

// Filter Field Types

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "amount"
  | "single-select"
  | "multi-select"
  | "boolean";

//  Operators per field type

export type TextOperator =
  | "contains"
  | "equals"
  | "starts_with"
  | "ends_with"
  | "not_contains";

export type NumberOperator =
  | "equals"
  | "not_equals"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "between";

export type DateOperator = "between" | "before" | "after" | "last_30_days";

export type AmountOperator = "between";

export type SingleSelectOperator = "is" | "is_not";

export type MultiSelectOperator = "in" | "not_in" | "contains_all";

export type BooleanOperator = "is";

export type Operator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SingleSelectOperator
  | MultiSelectOperator
  | BooleanOperator;

//  Filter Values

export interface DateRangeValue {
  from: string;
  to: string;
}

export interface AmountRangeValue {
  min: string;
  max: string;
}

export interface NumberBetweenValue {
  min: string;
  max: string;
}

export type FilterValue =
  | string
  | boolean
  | string[]
  | DateRangeValue
  | AmountRangeValue
  | NumberBetweenValue
  | null;

//  Filter Condition

export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: Operator;
  value: FilterValue;
  isValid: boolean;
}

//  Field Definition

export interface OperatorOption {
  value: Operator;
  label: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}

// Table Types

export type SortDir = "asc" | "desc" | null;

export interface SortConfig {
  key: string;
  dir: SortDir;
}
