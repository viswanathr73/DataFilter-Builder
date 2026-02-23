import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import type { Employee, SortConfig } from "../../types";
import { exportToCSV } from "../../utils/filterEngine";

// ─── Department colour map ────────────────────────────────────────────────────
// Defined OUTSIDE the component so the object is never recreated on re-renders
const DEPT_COLORS: Record<string, string> = {
  Engineering: "#60a5fa",
  Design: "#c084fc",
  Product: "#2dd4bf",
  Marketing: "#fbbf24",
  Sales: "#fb923c",
  HR: "#f472b6",
  Finance: "#34d399",
  Operations: "#9ca3af",
};

// ─── Column definitions ───────────────────────────────────────────────────────
// Defined OUTSIDE the component — recreating this array on every render would
// cause unnecessary object allocation and potential child re-mounts.
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (emp: Employee) => React.ReactNode;
}

const COLS: Column[] = [
  // ── ID ─────────────────────────────────────────────────────────────────
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (e) => (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        #{e.id}
      </Typography>
    ),
  },

  // ── Name + email ────────────────────────────────────────────────────────
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (e) => (
      <Box display="flex" alignItems="center" gap={1.2}>
        {/* Avatar circle shows first letter of employee name */}
        <Avatar
          sx={{
            width: 30,
            height: 30,
            fontSize: "0.72rem",
            fontWeight: 700,
            bgcolor: "rgba(245,166,35,0.12)",
            color: "primary.main",
            border: "1px solid rgba(245,166,35,0.25)",
          }}
          aria-hidden="true"
        >
          {e.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            color="text.primary"
            sx={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "0.8rem",
            }}
          >
            {e.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {e.email}
          </Typography>
        </Box>
      </Box>
    ),
  },

  // ── Department badge ────────────────────────────────────────────────────
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (e) => {
      const color = DEPT_COLORS[e.department] ?? "#9ca3af";
      return (
        <Chip
          label={e.department}
          size="small"
          sx={{
            color,
            bgcolor: `${color}18`,
            border: `1px solid ${color}33`,
            fontWeight: 500,
            fontSize: "0.68rem",
          }}
        />
      );
    },
  },

  // ── Role ────────────────────────────────────────────────────────────────
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (e) => (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {e.role}
      </Typography>
    ),
  },

  // ── Salary ──────────────────────────────────────────────────────────────
  {
    key: "salary",
    label: "Salary",
    sortable: true,
    render: (e) => (
      <Typography
        variant="body2"
        color="secondary.main"
        fontWeight={600}
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {e.salary.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
      </Typography>
    ),
  },

  // ── Performance rating + progress bar ────────────────────────────────────
  {
    key: "performanceRating",
    label: "Rating",
    sortable: true,
    render: (e) => (
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="body2"
          color="primary.main"
          fontWeight={700}
          sx={{ minWidth: 28, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {e.performanceRating.toFixed(1)}
        </Typography>
        {/* LinearProgress shows rating as a fraction of 5.0 */}
        <LinearProgress
          variant="determinate"
          value={(e.performanceRating / 5) * 100}
          color="primary"
          sx={{ width: 56, height: 4 }}
          aria-label={`Performance rating ${e.performanceRating} out of 5`}
        />
      </Box>
    ),
  },

  // ── Active status badge ──────────────────────────────────────────────────
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (e) => (
      <Chip
        label={e.isActive ? "Active" : "Inactive"}
        size="small"
        color={e.isActive ? "success" : "default"}
        variant="outlined"
        aria-label={e.isActive ? "Employee is active" : "Employee is inactive"}
      />
    ),
  },

  // ── Join date ────────────────────────────────────────────────────────────
  {
    key: "joinDate",
    label: "Joined",
    sortable: true,
    render: (e) => (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {new Date(e.joinDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Typography>
    ),
  },

  // ── Last review date ─────────────────────────────────────────────────────
  {
    key: "lastReview",
    label: "Last Review",
    sortable: true,
    render: (e) => (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {new Date(e.lastReview).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Typography>
    ),
  },

  // ── Skills chips ─────────────────────────────────────────────────────────
  {
    key: "skills",
    label: "Skills",
    render: (e) => (
      <Box
        display="flex"
        alignItems="center"
        gap={0.5}
        flexWrap="nowrap"
        aria-label={`Skills: ${e.skills.join(", ") || "none"}`}
      >
        {e.skills.length === 0 && (
          <Typography variant="caption" color="text.disabled">
            —
          </Typography>
        )}
        {e.skills.slice(0, 2).map((s) => (
          <Chip
            key={s}
            label={s}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.62rem",
              height: "18px",
              borderColor: "#33395a",
              color: "text.secondary",
            }}
          />
        ))}
        {/* Show remaining skill count as a tooltip-enabled chip */}
        {e.skills.length > 2 && (
          <Tooltip title={e.skills.slice(2).join(", ")} placement="top" arrow>
            <Chip
              label={`+${e.skills.length - 2}`}
              size="small"
              sx={{
                fontSize: "0.62rem",
                height: "18px",
                cursor: "help",
                color: "text.disabled",
              }}
            />
          </Tooltip>
        )}
      </Box>
    ),
  },

  // ── Location (nested object: address.city, address.state, address.country)
  {
    key: "address",
    label: "Location",
    render: (e) => (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {e.address.city}, {e.address.state}, {e.address.country}
      </Typography>
    ),
  },

  // ── Projects count ───────────────────────────────────────────────────────
  {
    key: "projects",
    label: "Projects",
    sortable: true,
    render: (e) => (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {e.projects}
      </Typography>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface EmployeeTableProps {
  data: Employee[];
  sort: SortConfig;
  onSort: (key: string) => void;
  totalCount: number;
  filteredCount: number;
}

/**
 * EmployeeTable — the full sortable data table.

 */
const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  sort,
  onSort,
  totalCount,
  filteredCount,
}) => {
  const isFiltered = filteredCount !== totalCount;

  const handleExport = () => {
    exportToCSV(data, "employees-filtered.csv");
  };

  return (
    <Paper
      variant="outlined"
      component="section"
      aria-label="Employee data table"
      sx={{ overflow: "hidden" }}
    >
      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.25,
          bgcolor: "#1e2332",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* Record count — aria-live so screen readers announce changes */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          role="status"
          aria-live="polite"
          aria-label="Filtered record count"
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Showing{" "}
            <Typography
              component="strong"
              color="text.primary"
              fontWeight={700}
              fontSize="inherit"
            >
              {filteredCount.toLocaleString()}
            </Typography>
            {isFiltered && (
              <>
                {" "}
                of{" "}
                <Typography
                  component="strong"
                  color="text.primary"
                  fontWeight={700}
                  fontSize="inherit"
                >
                  {totalCount.toLocaleString()}
                </Typography>
              </>
            )}{" "}
            employees
          </Typography>
          {/* Red badge showing how many were filtered out */}
          {isFiltered && (
            <Chip
              label={`${(totalCount - filteredCount).toLocaleString()} filtered out`}
              size="small"
              color="error"
              variant="outlined"
              sx={{ fontSize: "0.68rem" }}
            />
          )}
        </Box>

        {/* Export CSV button — disabled when no data to export */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon fontSize="small" />}
          onClick={handleExport}
          disabled={data.length === 0}
          aria-label={`Export ${filteredCount} employees to CSV`}
          sx={{
            borderColor: "#33395a",
            color: "text.secondary",
            "&:hover": { borderColor: "primary.main", color: "primary.main" },
          }}
        >
          Export CSV
        </Button>
      </Box>

      <Divider />

      {/* ── Scrollable table ────────────────────────────────────────────────── */}
      <TableContainer
        sx={{ maxHeight: "calc(100vh - 340px)", overflowX: "auto" }}
        tabIndex={0}
        aria-label="Employee table, scrollable"
      >
        <Table
          size="small"
          stickyHeader
          aria-label="Employees"
          aria-rowcount={filteredCount}
        >
          {/* ── Column headers ─────────────────────────────────────────────── */}
          <TableHead>
            <TableRow>
              {COLS.map((col) => (
                <TableCell
                  key={col.key}
                  scope="col"
                  sortDirection={
                    sort.key === col.key && sort.dir ? sort.dir : false
                  }
                  sx={{ position: "sticky", top: 0, zIndex: 1 }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sort.key === col.key && sort.dir !== null}
                      direction={
                        sort.key === col.key && sort.dir ? sort.dir : "asc"
                      }
                      onClick={() => onSort(col.key)}
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ── Table body ─────────────────────────────────────────────────── */}
          <TableBody>
            {data.length === 0 ? (
              /* Empty state row */
              <TableRow>
                <TableCell colSpan={COLS.length} sx={{ border: 0, p: 0 }}>
                  <Box
                    sx={{ py: 8, textAlign: "center" }}
                    role="status"
                    aria-label="No matching employees"
                  >
                    <SearchOffIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 1.5 }}
                      aria-hidden="true"
                    />
                    <Typography color="text.secondary" fontSize="0.875rem">
                      No employees match the current filters
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      display="block"
                      mt={0.5}
                      sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      Try adjusting or removing some filter conditions
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              /* Data rows */
              data.map((emp, rowIndex) => (
                <TableRow
                  key={emp.id}
                  hover
                  aria-rowindex={rowIndex + 1}
                  sx={{
                    // Alternating row background for readability
                    bgcolor:
                      rowIndex % 2 === 0
                        ? "transparent"
                        : "rgba(30,35,50,0.35)",
                  }}
                >
                  {COLS.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(emp)
                        : String(
                            (emp as unknown as Record<string, unknown>)[
                              col.key
                            ] ?? "",
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EmployeeTable;
