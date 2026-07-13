import { useCms } from "../../../cms/ContentProvider";
import {
  EditorCard,
  Field,
  RepeatableList,
  TextArea,
  TextInput,
} from "../fields";
import EditorHeader from "./EditorHeader";

export default function ContactEditor() {
  const { content, update } = useCms();

  return (
    <div className="space-y-6">
      <EditorHeader title="Contact & Footer" anchor="/#work-with-me" />

      <EditorCard title="Work with me">
        <Field label="Intro">
          <TextArea
            value={content.contact.intro}
            onChange={v => update(d => void (d.contact.intro = v))}
            rows={3}
          />
        </Field>
        <Field label="Contact email" hint="where the form sends messages">
          <TextInput
            value={content.contact.email}
            onChange={v => update(d => void (d.contact.email = v))}
            mono
          />
        </Field>
        <Field label="Social links">
          <RepeatableList
            items={content.contact.socials}
            onChange={socials =>
              update(d => void (d.contact.socials = socials))
            }
            newItem={() => ({ label: "", href: "" })}
            addLabel="+ Add link"
            renderItem={(item, patch) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label">
                  <TextInput
                    value={item.label}
                    onChange={label => patch({ label })}
                  />
                </Field>
                <Field label="URL">
                  <TextInput
                    value={item.href}
                    onChange={href => patch({ href })}
                    mono
                  />
                </Field>
              </div>
            )}
          />
        </Field>
      </EditorCard>

      <EditorCard title="Footer">
        <Field label="Name / copyright">
          <TextInput
            value={content.footer.name}
            onChange={v => update(d => void (d.footer.name = v))}
          />
        </Field>
        <Field label="Footer links">
          <RepeatableList
            items={content.footer.socials}
            onChange={socials => update(d => void (d.footer.socials = socials))}
            newItem={() => ({ label: "", href: "" })}
            addLabel="+ Add link"
            renderItem={(item, patch) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label">
                  <TextInput
                    value={item.label}
                    onChange={label => patch({ label })}
                  />
                </Field>
                <Field label="URL">
                  <TextInput
                    value={item.href}
                    onChange={href => patch({ href })}
                    mono
                  />
                </Field>
              </div>
            )}
          />
        </Field>
      </EditorCard>

      <EditorCard title="Site meta">
        <Field label="Your name">
          <TextInput
            value={content.meta.name}
            onChange={v => update(d => void (d.meta.name = v))}
          />
        </Field>
        <Field label="Title / tagline" hint="used in the browser tab">
          <TextInput
            value={content.meta.title}
            onChange={v => update(d => void (d.meta.title = v))}
          />
        </Field>
      </EditorCard>
    </div>
  );
}
