import { useState, useMemo } from 'react';
import type { Employee, SortConfig } from '../types';
import { getNestedValue } from '../utils/filterEngine';

/**
 * Manages sort state and returns a sorted copy of the input data.
 * Cycles through: asc → desc → null (unsorted) → asc …
 */
export function useSortedData(data: Employee[]) {
  const [sort, setSort] = useState<SortConfig>({ key: 'id', dir: 'asc' });

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      const next =
        prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc';
      return { key, dir: next };
    });
  };

  const sortedData = useMemo(() => {
    if (!sort.dir) return data;

    return [...data].sort((a, b) => {
      const av = getNestedValue(a as unknown as Record<string, unknown>, sort.key);
      const bv = getNestedValue(b as unknown as Record<string, unknown>, sort.key);

      let cmp = 0;
      if (typeof av === 'string' && typeof bv === 'string') {
        cmp = av.toLowerCase().localeCompare(bv.toLowerCase());
      } else if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
        cmp = Number(av) - Number(bv);
      }

      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);

  return { sortedData, sort, toggleSort };
}
