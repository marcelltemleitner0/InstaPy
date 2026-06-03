import { useEffect, useState } from "react";

type Row = {
  id: number;
  username: string;
  follows_viewer: boolean;
};

type Filter = "all" | "mutual" | "ghost";

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/instagram/following");
        const data = await res.json();
        setRows(data.results);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mutual = rows.filter((r) => r.follows_viewer).length;
  const ghosts = rows.filter((r) => !r.follows_viewer).length;

  const filtered = rows
    .filter((r) => r.username.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => {
      if (filter === "mutual") return r.follows_viewer;
      if (filter === "ghost") return !r.follows_viewer;
      return true;
    });

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
          {rows.length} accounts &mdash; {mutual} follow you back, {ghosts}{" "}
          don&apos;t
        </p>
      </div>

      <div className="relative mb-4">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        />
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

      <ul role="list" className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <li className="py-16 text-center text-sm text-gray-400">
            No accounts found
          </li>
        ) : (
          filtered.map((person) => (
            <li key={person.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    @{person.username}
                  </p>
                  <p className="mt-1 truncate text-xs/5 text-gray-400">
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
                    <p className="text-xs/5 text-gray-500">Follows you</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-gray-300/40 p-1">
                      <div className="size-1.5 rounded-full bg-gray-400" />
                    </div>
                    <p className="text-xs/5 text-gray-400">
                      Doesn&apos;t follow back
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
