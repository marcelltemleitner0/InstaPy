import { useEffect, useState } from "react";
import { Search, HatGlasses, ChevronLeft, ChevronRight } from "lucide-react";
import { type Row, type Filter } from "./types";
import { useToast } from "./toast/useToast";
import { ToastList } from "./toast/toastList";
import { SkeletonRow } from "./SkeletonRow";
import { FilterTabs } from "./FilterTabs";

const ITEMS_PER_PAGE = 10;

export default function DataTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [unfollowing, setUnfollowing] = useState(false);

  const { toasts, pushToast, dismissToast } = useToast();

  useEffect(() => {
    const fetchList = async () => {
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
    fetchList();
  }, []);

  const handleUnfollow = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    setUnfollowing(true);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const username = rows.find((r) => r.id === id)?.username ?? `id:${id}`;
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/instagram/unfollow/${id}/`,
          { method: "POST" },
        );
        if (res.ok) {
          setRows((prev) => prev.filter((r) => r.id !== id));
          setSelected((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          pushToast(username, true);
        } else {
          pushToast(username, false);
        }
      } catch {
        pushToast(username, false);
      }
      if (i < ids.length - 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, 5000));
      }
    }
    setUnfollowing(false);
  };

  const filtered = rows
    .filter((r) => r.username.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => {
      if (filter === "mutual") return r.follows_viewer;
      if (filter === "ghost") return !r.follows_viewer;
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedRows = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const allSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selected.has(r.id));
  const disabled = selected.size === 0 || unfollowing;

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const pageSelected = paginatedRows.every((r) => next.has(r.id));

      if (pageSelected) {
        paginatedRows.forEach((r) => next.delete(r.id));
      } else {
        paginatedRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const mutualCount = rows.filter((r) => r.follows_viewer).length;
  const ghostCount = rows.filter((r) => !r.follows_viewer).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ToastList
        toasts={toasts}
        anonymous={anonymous}
        onDismiss={dismissToast}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Following
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {rows.length} accounts — {mutualCount} follow you back, {ghostCount}{" "}
          don't
        </p>
      </div>

      <FilterTabs
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={{ all: rows.length, mutual: mutualCount, ghost: ghostCount }}
      />

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
        <button
          onClick={toggleSelectAll}
          className="absolute right-0 top-full mt-2 rounded-md bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-700"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
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

      <div className="fixed bottom-6 right-6 flex items-center gap-2">
        <button
          disabled={disabled}
          onClick={handleUnfollow}
          className={`rounded-md px-3 py-2 text-xs text-white transition-colors ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {unfollowing ? "Unfollowing…" : "Unfollow"}
        </button>

        <button
          onClick={() => setAnonymous((prev) => !prev)}
          className="flex size-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-700"
        >
          {anonymous ? <HatGlasses size={24} strokeWidth={1.5} /> : "A"}
        </button>
      </div>
    </div>
  );
}
