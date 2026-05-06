export function OccupantSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton w-14 h-14 rounded-2xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
