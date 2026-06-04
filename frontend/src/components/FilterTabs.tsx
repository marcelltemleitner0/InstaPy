import { type Filter } from "./types";

interface FilterTabsProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  counts: {
    all: number;
    mutual: number;
    ghost: number;
  };
}

export function FilterTabs({
  currentFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const filters: { label: string; value: Filter; count: number }[] = [
    { label: "All", value: "all", count: counts.all },
    { label: "Follows Back", value: "mutual", count: counts.mutual },
    { label: "Ghosts", value: "ghost", count: counts.ghost },
  ];

  return (
    <div className="mb-5 flex gap-2">
      {filters.map(({ label, value, count }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            currentFilter === value
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              currentFilter === value
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
