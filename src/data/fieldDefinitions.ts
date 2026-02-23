import type {
  FieldDefinition,
  FieldType,
  FilterValue,
  DateRangeValue,
  AmountRangeValue,
  NumberBetweenValue,
  OperatorOption,
  Operator,
} from "../types";

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
];

export const COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Germany",
  "Australia",
  "India",
];

export const ALL_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Python",
  "Java",
  "Go",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Vue.js",
  "Angular",
  "Swift",
  "Kotlin",
  "Figma",
  "Sketch",
  "Agile",
  "Scrum",
];

// Every filterable field in the system. Adding a new field = one entry here.
export const FIELD_DEFINITIONS: FieldDefinition[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "text" },
  {
    key: "department",
    label: "Department",
    type: "single-select",
    options: DEPARTMENTS,
  },
  { key: "role", label: "Role", type: "text" },
  { key: "salary", label: "Salary", type: "amount" },
  { key: "joinDate", label: "Join Date", type: "date" },
  { key: "lastReview", label: "Last Review", type: "date" },
  { key: "isActive", label: "Active Status", type: "boolean" },
  { key: "skills", label: "Skills", type: "multi-select", options: ALL_SKILLS },
  { key: "address.city", label: "City", type: "text" },
  { key: "address.state", label: "State", type: "text" },
  {
    key: "address.country",
    label: "Country",
    type: "single-select",
    options: COUNTRIES,
  },
  { key: "projects", label: "Projects Count", type: "number" },
  { key: "performanceRating", label: "Performance Rating", type: "number" },
];

// All operators available per field type
export const OPERATORS_BY_TYPE: Record<FieldType, OperatorOption[]> = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
    { value: "not_contains", label: "Does Not Contain" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equal" },
    { value: "gt", label: "Greater Than" },
    { value: "lt", label: "Less Than" },
    { value: "gte", label: "≥ Greater or Equal" },
    { value: "lte", label: "≤ Less or Equal" },
    { value: "between", label: "Between" },
  ],
  date: [
    { value: "between", label: "Between" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "last_30_days", label: "Last 30 Days" },
  ],
  amount: [{ value: "between", label: "Between" }],
  "single-select": [
    { value: "is", label: "Is" },
    { value: "is_not", label: "Is Not" },
  ],
  "multi-select": [
    { value: "in", label: "Contains Any" },
    { value: "not_in", label: "Contains None" },
    { value: "contains_all", label: "Contains All" },
  ],
  boolean: [{ value: "is", label: "Is" }],
};

// Default operator selected when a field type is first chosen
export const DEFAULT_OPERATOR: Record<FieldType, Operator> = {
  text: "contains",
  number: "equals",
  date: "between",
  amount: "between",
  "single-select": "is",
  "multi-select": "in",
  boolean: "is",
};

// Default empty value for each field type
export const DEFAULT_VALUE: Record<FieldType, FilterValue> = {
  text: "",
  number: "",
  date: { from: "", to: "" } as DateRangeValue,
  amount: { min: "", max: "" } as AmountRangeValue,
  "single-select": "",
  "multi-select": [],
  boolean: true,
};

/**
 * Returns a deep-cloned default value for a given field type.
 * Deep-cloning prevents mutations of the shared DEFAULT_VALUE objects.
 */
export function getDefaultValue(type: FieldType): FilterValue {
  return JSON.parse(JSON.stringify(DEFAULT_VALUE[type])) as FilterValue;
}

/**
 * Returns the default operator for a given field type.
 */
export function getDefaultOperator(type: FieldType): Operator {
  return DEFAULT_OPERATOR[type];
}

/**
 * Returns operators available for a given field type,
 * filtered to only single-value operators when needed for the "between" number case.
 */
export function getOperatorsForField(type: FieldType): OperatorOption[] {
  return OPERATORS_BY_TYPE[type];
}
