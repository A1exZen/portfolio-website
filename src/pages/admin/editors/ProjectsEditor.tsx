import { useState } from "react";
import { useCms } from "../../../cms/ContentProvider";
import type { Project, CaseSection, Tone } from "../../../data/projects";
import {
  EditorCard,
  Field,
  ImageInput,
  RepeatableList,
  Select,
  StringList,
  TextArea,
  TextInput,
  Toggle,
} from "../fields";
import EditorHeader from "./EditorHeader";

const toneOptions: { value: Tone; label: string }[] = [
  { value: "neutral", label: "Neutral" },
  { value: "dark", label: "Dark" },
  { value: "accent", label: "Accent (blue)" },
];

const sectionIdOptions: { value: CaseSection["id"]; label: string }[] = [
  { value: "problem", label: "Problem" },
  { value: "solution", label: "Solution" },
  { value: "outcome", label: "Outcome" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function newProject(): Project {
  return {
    slug: `project-${Date.now()}`,
    title: "New project",
    tag: "Tag",
    tagTone: "neutral",
    year: String(new Date().getFullYear()),
    live: true,
    cardDesc: "",
    imgLabel: "Project",
    intro: "",
    focus: "",
    area: "",
    role: "",
    sections: [],
  };
}

export default function ProjectsEditor() {
  const { content, update } = useCms();
  const projects = content.projects;
  const [active, setActive] = useState(0);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    update(d => {
      const arr = d.projects;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });
    setActive(j);
  };

  const remove = (i: number) => {
    if (!window.confirm("Delete this project?")) return;
    update(d => void d.projects.splice(i, 1));
    setActive(a => Math.max(0, a >= i ? a - 1 : a));
  };

  const add = () => {
    update(d => void d.projects.push(newProject()));
    setActive(projects.length);
  };

  const project = projects[active];

  return (
    <div className="space-y-6">
      <EditorHeader title="Projects" anchor="/#work" />

      <EditorCard
        title="All projects"
        description="Live projects get a full case-study page; others show as “Coming soon” cards."
      >
        <div className="space-y-2">
          {projects.map((p, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                i === active
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                onClick={() => setActive(i)}
                className="flex-1 text-left"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {p.tag}
                </span>
                <span className="ml-2 font-medium text-slate-800">
                  {p.title}
                </span>
                {!p.live && (
                  <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                    coming soon
                  </span>
                )}
              </button>
              <div className="flex gap-1">
                <ArrowBtn label="Move up" onClick={() => move(i, -1)}>
                  ↑
                </ArrowBtn>
                <ArrowBtn label="Move down" onClick={() => move(i, 1)}>
                  ↓
                </ArrowBtn>
                <button
                  onClick={() => remove(i)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={add}
            className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            + Add project
          </button>
        </div>
      </EditorCard>

      {project && (
        <ProjectForm
          key={active}
          project={project}
          onChange={mutate =>
            update(d => {
              mutate(d.projects[active]);
            })
          }
        />
      )}
    </div>
  );
}

function ProjectForm({
  project,
  onChange,
}: {
  project: Project;
  onChange: (mutate: (p: Project) => void) => void;
}) {
  return (
    <>
      <EditorCard title="Project card" description="Shown in the Case Studies slider.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tag">
            <TextInput
              value={project.tag}
              onChange={v => onChange(p => void (p.tag = v))}
            />
          </Field>
          <Field label="Tag colour">
            <Select
              value={project.tagTone}
              onChange={v => onChange(p => void (p.tagTone = v))}
              options={toneOptions}
            />
          </Field>
        </div>
        <Field label="Title">
          <TextInput
            value={project.title}
            onChange={v => onChange(p => void (p.title = v))}
          />
        </Field>
        <Field label="Card description" hint="revealed on hover">
          <TextArea
            value={project.cardDesc}
            onChange={v => onChange(p => void (p.cardDesc = v))}
            rows={2}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Year">
            <TextInput
              value={project.year}
              onChange={v => onChange(p => void (p.year = v))}
            />
          </Field>
          <Field label="Image label">
            <TextInput
              value={project.imgLabel}
              onChange={v => onChange(p => void (p.imgLabel = v))}
            />
          </Field>
        </div>
        <Field label="Card image">
          <ImageInput
            src={project.imgSrc}
            onChange={src => onChange(p => void (p.imgSrc = src))}
          />
        </Field>
        <Toggle
          value={project.live}
          onChange={v => onChange(p => void (p.live = v))}
          label="Live — has a full case-study page"
        />
      </EditorCard>

      {project.live && (
        <>
          <EditorCard title="Case study cover">
            <Field label="Slug" hint="the URL path, lowercase-with-dashes">
              <div className="flex gap-2">
                <TextInput
                  value={project.slug}
                  onChange={v => onChange(p => void (p.slug = v))}
                  mono
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange(p => void (p.slug = slugify(p.title)))
                  }
                  className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  From title
                </button>
              </div>
            </Field>
            <Field label="Intro">
              <TextArea
                value={project.intro}
                onChange={v => onChange(p => void (p.intro = v))}
                rows={3}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Focus">
                <TextInput
                  value={project.focus}
                  onChange={v => onChange(p => void (p.focus = v))}
                />
              </Field>
              <Field label="Area of work">
                <TextInput
                  value={project.area}
                  onChange={v => onChange(p => void (p.area = v))}
                />
              </Field>
              <Field label="Role">
                <TextInput
                  value={project.role}
                  onChange={v => onChange(p => void (p.role = v))}
                />
              </Field>
            </div>
          </EditorCard>

          <EditorCard
            title="Sections"
            description="Problem → Approach → Decisions → Outcomes → Learnings."
          >
            <RepeatableList
              items={project.sections}
              onChange={sections => onChange(p => void (p.sections = sections))}
              newItem={(): CaseSection => ({
                id: "problem",
                eyebrow: "Problem",
                heading: "New section",
                body: [""],
              })}
              addLabel="+ Add section"
              renderItem={(section, patch) => (
                <SectionForm section={section} patch={patch} />
              )}
            />
          </EditorCard>
        </>
      )}
    </>
  );
}

function SectionForm({
  section,
  patch,
}: {
  section: CaseSection;
  patch: (next: Partial<CaseSection>) => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <Field label="Anchor">
          <Select
            value={section.id}
            onChange={id => patch({ id })}
            options={sectionIdOptions}
          />
        </Field>
        <Field label="Eyebrow">
          <TextInput
            value={section.eyebrow}
            onChange={eyebrow => patch({ eyebrow })}
          />
        </Field>
      </div>
      <Field label="Heading">
        <TextInput
          value={section.heading}
          onChange={heading => patch({ heading })}
        />
      </Field>
      <Field label="Body paragraphs">
        <StringList
          items={section.body}
          onChange={body => patch({ body })}
          multiline
          placeholder="Paragraph…"
        />
      </Field>
      <Field label="Bullets" hint="optional">
        <StringList
          items={section.bullets ?? []}
          onChange={bullets => patch({ bullets })}
          placeholder="Bullet…"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Image label" hint="optional">
          <TextInput
            value={section.image ?? ""}
            onChange={image => patch({ image: image || undefined })}
          />
        </Field>
        <Field label="Section image">
          <ImageInput
            src={section.imageSrc}
            onChange={imageSrc => patch({ imageSrc })}
          />
        </Field>
      </div>
      <Field label="Process steps" hint="optional — usually on Approach">
        <RepeatableList
          items={section.process ?? []}
          onChange={process => patch({ process })}
          newItem={() => ({ step: "", detail: "" })}
          addLabel="+ Add step"
          renderItem={(item, p) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput value={item.step} onChange={step => p({ step })} />
              <TextInput
                value={item.detail ?? ""}
                onChange={detail => p({ detail })}
              />
            </div>
          )}
        />
      </Field>
      <Field label="Metrics" hint="optional — usually on Outcomes">
        <RepeatableList
          items={section.metrics ?? []}
          onChange={metrics => patch({ metrics })}
          newItem={() => ({ value: "", label: "" })}
          addLabel="+ Add metric"
          renderItem={(item, p) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput value={item.value} onChange={value => p({ value })} />
              <TextInput value={item.label} onChange={label => p({ label })} />
            </div>
          )}
        />
      </Field>
    </>
  );
}

function ArrowBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}
