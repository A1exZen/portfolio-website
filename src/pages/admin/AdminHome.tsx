import { Link } from "react-router-dom";
import { useContent } from "../../cms/ContentProvider";

const cards = [
  { to: "/admin/hero", label: "Hero", desc: "Headline, subtitle, fanned cards" },
  {
    to: "/admin/showcase",
    label: "Showcase grid",
    desc: "Featured card + 8 grid thumbnails",
  },
  {
    to: "/admin/background",
    label: "Background",
    desc: "Intro copy, disciplines, stats",
  },
  {
    to: "/admin/skills",
    label: "Skills & Tools",
    desc: "Process steps and skill groups",
  },
  { to: "/admin/resume", label: "Resume", desc: "Description and PDF link" },
  {
    to: "/admin/projects",
    label: "Projects",
    desc: "Case studies and slider cards",
  },
  {
    to: "/admin/contact",
    label: "Contact & Footer",
    desc: "Intro, socials, email",
  },
];

export default function AdminHome() {
  const content = useContent();
  const liveCount = content.projects.filter(p => p.live).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">
        Editing content for <strong>{content.meta.name}</strong> —{" "}
        {content.meta.title}.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Stat label="Projects" value={content.projects.length} />
        <Stat label="Live case studies" value={liveCount} />
        <Stat label="Skill groups" value={content.skills.groups.length} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <p className="font-semibold text-slate-900 group-hover:text-blue-600">
              {c.label}
            </p>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">How publishing works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Edits save to this browser automatically (instant preview on the site).</li>
          <li>Click <strong>Export JSON</strong> in the toolbar to download your content.</li>
          <li>
            To make edits visible to visitors, commit that JSON into the repo (or
            wire it as the default) and redeploy.
          </li>
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
      <span className="text-lg font-bold text-slate-900">{value}</span>{" "}
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
