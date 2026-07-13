import { useCms } from "../../../cms/ContentProvider";
import { EditorCard, Field, TextArea, TextInput } from "../fields";
import EditorHeader from "./EditorHeader";

export default function ResumeEditor() {
  const { content, update } = useCms();
  const resume = content.resume;

  return (
    <div className="space-y-6">
      <EditorHeader title="Resume" anchor="/#resume" />
      <EditorCard title="Resume section">
        <Field label="Description">
          <TextArea
            value={resume.description}
            onChange={v => update(d => void (d.resume.description = v))}
            rows={2}
          />
        </Field>
        <Field
          label="PDF link"
          hint="path in /public (e.g. /resume.pdf) or a full URL"
        >
          <TextInput
            value={resume.pdfUrl}
            onChange={v => update(d => void (d.resume.pdfUrl = v))}
            mono
          />
        </Field>
      </EditorCard>
    </div>
  );
}
