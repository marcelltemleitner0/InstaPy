export function SkeletonRow() {
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
