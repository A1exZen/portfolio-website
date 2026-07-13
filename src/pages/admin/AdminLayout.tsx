import { useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCms } from "../../cms/ContentProvider";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/hero", label: "Hero" },
  { to: "/admin/showcase", label: "Showcase grid" },
  { to: "/admin/background", label: "Background" },
  { to: "/admin/skills", label: "Skills & Tools" },
  { to: "/admin/resume", label: "Resume" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/contact", label: "Contact & Footer" },
];

export default function AdminLayout() {
  const { exportJson, importJson, reset, isCustomised, storageError } = useCms();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const res = importJson(String(reader.result));
      setMsg(res.ok ? "Content imported." : `Import failed: ${res.error}`);
      window.setTimeout(() => setMsg(null), 4000);
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex">
          <div className="px-2 pb-4">
            <p className="font-pixel text-lg font-bold">Content CMS</p>
            <p className="text-xs text-slate-400">Portfolio admin</p>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/"
            className="mt-4 block rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← View site
          </Link>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Top toolbar */}
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mr-auto">
              <p className="text-sm font-semibold text-slate-700">
                {isCustomised ? "Edited (saved in this browser)" : "Default content"}
              </p>
              <p className="text-xs text-slate-400">
                Changes save to your browser instantly. Export to publish them.
              </p>
            </div>
            <button
              onClick={exportJson}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Export JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Import JSON
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all content to the original defaults? Your edits in this browser will be lost."
                  )
                ) {
                  reset();
                  setMsg("Content reset to defaults.");
                  window.setTimeout(() => setMsg(null), 4000);
                }
              }}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Reset
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={e => e.target.files?.[0] && onImportFile(e.target.files[0])}
            />
          </div>

          {storageError && (
            <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              {storageError}
            </div>
          )}
          {msg && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              {msg}
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
