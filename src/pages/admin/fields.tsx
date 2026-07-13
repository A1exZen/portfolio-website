import { useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Small, unstyled-ish building blocks for the admin editors. These are
 * deliberately plain (admin chrome, not the marketing site's visual
 * language) and fully controlled.
 * ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {hint && <span className="ml-2 font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function TextInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputBase} ${mono ? "font-mono text-sm" : ""}`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputBase} resize-y`}
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className={inputBase}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            value ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}

/** Image slot editor: preview + URL input + file upload (→ data URL). */
export function ImageInput({
  src,
  onChange,
}: {
  src?: string;
  onChange: (v: string | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState<string | null>(null);

  function onFile(file: File) {
    if (file.size > 1_500_000) {
      setWarn(
        "This image is over ~1.5MB. Browser storage is limited — prefer an image URL for large images."
      );
    } else {
      setWarn(null);
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex gap-4">
      <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-slate-400">No image</span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input
          value={src && !src.startsWith("data:") ? src : ""}
          onChange={e => onChange(e.target.value || undefined)}
          placeholder="Paste an image URL…"
          className={inputBase}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Upload…
          </button>
          {src && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setWarn(null);
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </div>
        {warn && <p className="text-xs text-amber-600">{warn}</p>}
      </div>
    </div>
  );
}

/** Editable list of plain strings (tags, bullets, paragraphs). */
export function StringList({
  items,
  onChange,
  placeholder,
  multiline,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              value={it}
              onChange={e => set(i, e.target.value)}
              rows={2}
              placeholder={placeholder}
              className={`${inputBase} resize-y`}
            />
          ) : (
            <input
              value={it}
              onChange={e => set(i, e.target.value)}
              placeholder={placeholder}
              className={inputBase}
            />
          )}
          <ItemControls
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            onRemove={() => remove(i)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        + Add
      </button>
    </div>
  );
}

/** Generic list of objects with add / remove / reorder. */
export function RepeatableList<T>({
  items,
  onChange,
  newItem,
  addLabel = "+ Add item",
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel?: string;
  renderItem: (item: T, patch: (next: Partial<T>) => void, index: number) => ReactNode;
}) {
  const patchAt = (i: number, next: Partial<T>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...next } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              #{i + 1}
            </span>
            <ItemControls
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              onRemove={() => remove(i)}
            />
          </div>
          <div className="space-y-3">
            {renderItem(it, next => patchAt(i, next), i)}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        {addLabel}
      </button>
    </div>
  );
}

function ItemControls({
  onUp,
  onDown,
  onRemove,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  const btn =
    "grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50";
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" onClick={onUp} className={btn} aria-label="Move up">
        ↑
      </button>
      <button
        type="button"
        onClick={onDown}
        className={btn}
        aria-label="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="grid h-8 w-8 place-items-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}

/** A titled card that groups related fields in an editor page. */
export function EditorCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
