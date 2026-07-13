import { useCms } from "../../../cms/ContentProvider";
import {
  EditorCard,
  Field,
  RepeatableList,
  StringList,
  TextInput,
} from "../fields";
import EditorHeader from "./EditorHeader";

export default function BackgroundEditor() {
  const { content, update } = useCms();
  const bg = content.background;

  return (
    <div className="space-y-6">
      <EditorHeader title="About Me" anchor="/#background" />

      <EditorCard title="Intro paragraphs">
        <StringList
          items={bg.intro}
          onChange={intro => update(d => void (d.background.intro = intro))}
          multiline
          placeholder="Paragraph…"
        />
      </EditorCard>

      <EditorCard
        title="Stats"
        description="The row of numbers below the intro. Leave empty to hide the row."
      >
        <RepeatableList
          items={bg.stats}
          onChange={stats => update(d => void (d.background.stats = stats))}
          newItem={() => ({ value: "", label: "" })}
          addLabel="+ Add stat"
          renderItem={(item, patch) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Value">
                <TextInput
                  value={item.value}
                  onChange={value => patch({ value })}
                />
              </Field>
              <Field label="Label">
                <TextInput
                  value={item.label}
                  onChange={label => patch({ label })}
                />
              </Field>
            </div>
          )}
        />
      </EditorCard>
    </div>
  );
}
