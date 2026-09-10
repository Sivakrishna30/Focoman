import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="mt-2 text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          The page or workspace you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-sky-600"
          >
            Go to Home
          </Link>
          <Link
            href="/workspaces"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            My Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}
