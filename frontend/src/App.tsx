import { useEffect, useMemo, useState } from "react";
import { Search, HatGlasses, ChevronLeft, ChevronRight } from "lucide-react";

type Row = {
  id: number;
  username: string;
  follows_viewer: boolean;
};

const mockRows: Row[] = [
  { id: 1, username: "johndoe", follows_viewer: true },
  { id: 2, username: "janedoe", follows_viewer: false },
  { id: 3, username: "alex_dev", follows_viewer: true },
  { id: 4, username: "reactlover", follows_viewer: false },
  { id: 5, username: "tailwindcss", follows_viewer: true },
  { id: 6, username: "frontendguy", follows_viewer: false },
  { id: 7, username: "typescriptfan", follows_viewer: true },
  { id: 8, username: "ui_designer", follows_viewer: false },
  { id: 9, username: "nextjs_dev", follows_viewer: true },
  { id: 10, username: "webbuilder", follows_viewer: false },
  { id: 11, username: "designmaster", follows_viewer: true },
  { id: 12, username: "fullstacklife", follows_viewer: false },
];

type Filter = "all" | "mutual" | "ghost";

const ITEMS_PER_PAGE = 10;

function SkeletonRow() {
  return (
    <li className="flex justify-between gap-x-6 py-5 animate-pulse">
      <div className="min-w-0 space-y-2 pt-1">
        <div className="h-3.5 w-32 rounded-full bg-gray-200" />
        <div className="h-3 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end justify-center gap-y-2">
        <div className="h-3 w-20 rounded-full bg-gray-200" />
      </div>
    </li>
  );
}

export default function DataTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setRows(mockRows);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const mutual = rows.filter((r) => r.follows_viewer).length;
  const ghosts = rows.filter((r) => !r.follows_viewer).length;

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.username.toLowerCase().includes(search.toLowerCase()))
      .filter((r) => {
        if (filter === "mutual") return r.follows_viewer;
        if (filter === "ghost") return !r.follows_viewer;
        return true;
      });
  }, [rows, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginatedRows = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filters: { label: string; value: Filter; count: number }[] = [
    { label: "All", value: "all", count: rows.length },
    { label: "Follows Back", value: "mutual", count: mutual },
    { label: "Ghosts", value: "ghost", count: ghosts },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Following
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {rows.length} accounts — {mutual} follow you back, {ghosts} don't
        </p>
      </div>

      <div className="mb-5 flex gap-2">
        {filters.map(({ label, value, count }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}

            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                filter === value
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        />
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : paginatedRows.length === 0 ? (
          <li className="py-16 text-center text-sm text-gray-400">
            No accounts found
          </li>
        ) : (
          paginatedRows.map((person) => (
            <li key={person.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4 items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(person.id)}
                  onChange={() => toggleRow(person.id)}
                  className="accent-black"
                />

                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">
                    {anonymous ? "Instagram User" : `@${person.username}`}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    ID {person.id}
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end sm:justify-center">
                {person.follows_viewer ? (
                  <div className="flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <p className="text-xs text-gray-500">Follows you</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-gray-300/40 p-1">
                      <div className="size-1.5 rounded-full bg-gray-400" />
                    </div>

                    <p className="text-xs text-gray-400">Doesn't follow back</p>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {!loading && filtered.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                  page === num
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <button
        onClick={() => setAnonymous((prev) => !prev)}
        className="fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-700"
      >
        {anonymous ? <HatGlasses size={24} strokeWidth={1.5} /> : "A"}
      </button>
    </div>
  );
}
