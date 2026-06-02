import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FILTER_PARAMS = [
  "classFilter",
  "locationFilter",
  "sortBy",
  "subjects",
  "search",
];

const deserializeFilters = (searchParams) => {
  const filters = {};
  for (const key of FILTER_PARAMS) {
    const val = key === "search" ? searchParams.get("q") : searchParams.get(key);
    if (val === null) continue;
    if (key === "subjects") {
      filters[key] = val ? val.split(",") : [];
    } else {
      filters[key] = val;
    }
  }
  return filters;
};

export const useTuitionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const fromUrl = deserializeFilters(searchParams);
    return {
      search: fromUrl.search ?? "",
      classFilter: fromUrl.classFilter ?? "",
      locationFilter: fromUrl.locationFilter ?? "",
      subjects: fromUrl.subjects ?? [],
      sortBy: fromUrl.sortBy ?? "newest",
    };
  });

  // Sync filters to URL (replace, not push)
  useEffect(() => {
    const params = {};
    if (filters.search) params.q = filters.search;
    if (filters.classFilter) params.classFilter = filters.classFilter;
    if (filters.locationFilter) params.locationFilter = filters.locationFilter;
    if (filters.subjects.length > 0)
      params.subjects = filters.subjects.join(",");
    if (filters.sortBy && filters.sortBy !== "newest")
      params.sortBy = filters.sortBy;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = useCallback((key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      classFilter: "",
      locationFilter: "",
      subjects: [],
      sortBy: "newest",
    });
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.classFilter ||
    filters.locationFilter ||
    filters.subjects.length > 0 ||
    filters.sortBy !== "newest"
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
