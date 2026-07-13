import { useContent } from "../cms/ContentProvider";

export default function Footer() {
  const { footer } = useContent();
  return (
    <footer className="bg-cloud">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/50 sm:flex-row">
        <p className="font-pixel tracking-wide">
          © {new Date().getFullYear()} {footer.name}
        </p>
        <div className="flex gap-6 font-medium">
          {footer.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
