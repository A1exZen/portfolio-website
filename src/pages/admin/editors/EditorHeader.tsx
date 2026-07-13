import { Link } from "react-router-dom";

/** Title row for an editor page, with a link to view that section on the site. */
export default function EditorHeader({
  title,
  anchor,
}: {
  title: string;
  anchor: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <Link
        to={anchor}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        View on site ↗
      </Link>
    </div>
  );
}
