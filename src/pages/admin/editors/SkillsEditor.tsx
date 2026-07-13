import { useCms } from "../../../cms/ContentProvider";
import {
  EditorCard,
  Field,
  RepeatableList,
  StringList,
  TextInput,
} from "../fields";
import EditorHeader from "./EditorHeader";

export default function SkillsEditor() {
  const { content, update } = useCms();
  const skills = content.skills;

  return (
    <div className="space-y-6">
      <EditorHeader title="Skills & Tools" anchor="/#skills" />

      <EditorCard
        title="Design process"
        description="The sticky, scroll-driven steps. Shared with every case study."
      >
        <RepeatableList
          items={skills.process}
          onChange={process => update(d => void (d.skills.process = process))}
          newItem={() => ({ step: "New step", detail: "" })}
          addLabel="+ Add step"
          renderItem={(item, patch) => (
            <>
              <Field label="Step">
                <TextInput value={item.step} onChange={step => patch({ step })} />
              </Field>
              <Field label="Detail">
                <TextInput
                  value={item.detail ?? ""}
                  onChange={detail => patch({ detail })}
                />
              </Field>
            </>
          )}
        />
      </EditorCard>

      <EditorCard
        title="Skill groups"
        description="Each group scrolls its tags as an infinite marquee."
      >
        <RepeatableList
          items={skills.groups}
          onChange={groups => update(d => void (d.skills.groups = groups))}
          newItem={() => ({ index: "00", label: "New group", tags: [] })}
          addLabel="+ Add group"
          renderItem={(item, patch) => (
            <>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <Field label="Index">
                  <TextInput
                    value={item.index}
                    onChange={index => patch({ index })}
                  />
                </Field>
                <Field label="Label">
                  <TextInput
                    value={item.label}
                    onChange={label => patch({ label })}
                  />
                </Field>
              </div>
              <Field label="Tags">
                <StringList
                  items={item.tags}
                  onChange={tags => patch({ tags })}
                  placeholder="Skill / tool…"
                />
              </Field>
            </>
          )}
        />
      </EditorCard>
    </div>
  );
}
