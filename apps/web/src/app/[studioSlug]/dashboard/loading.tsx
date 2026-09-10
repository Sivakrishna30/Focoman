export default function DashboardLoading() {
  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-10 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 rounded-lg bg-slate-200"></div>
        <div className="mt-2 h-4 w-96 rounded-md bg-slate-200"></div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-3 w-20 rounded bg-slate-200"></div>
            <div className="mt-3 h-8 w-16 rounded bg-slate-200"></div>
            <div className="mt-2 h-3 w-24 rounded bg-slate-100"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="h-5 w-40 rounded bg-slate-200"></div>
            <div className="h-4 w-24 rounded bg-slate-200"></div>
          </div>
          <div className="mt-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl border border-slate-100 bg-slate-50"></div>
            ))}
          </div>
        </div>

        <div className="h-96 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-36 rounded bg-slate-200"></div>
          <div className="mt-4 space-y-2">
            <div className="h-10 rounded-xl bg-slate-100"></div>
            <div className="h-10 rounded-xl bg-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
