import { useCms } from "../../../cms/ContentProvider";
import type { ImageSlot } from "../../../cms/content";
import { EditorCard, Field, ImageInput, RepeatableList, TextInput } from "../fields";
import EditorHeader from "./EditorHeader";

export default function ShowcaseEditor() {
  const { content, update } = useCms();
  const showcase = content.showcase;

  return (
    <div className="space-y-6">
      <EditorHeader title="Showcase grid" anchor="/" />

      <EditorCard
        title="Featured card"
        description="The card that grows in the centre before docking into the grid."
      >
        <Field label="Label">
          <TextInput
            value={showcase.focal.label}
            onChange={v => update(d => void (d.showcase.focal.label = v))}
          />
        </Field>
        <Field label="Image">
          <ImageInput
            src={showcase.focal.src}
            onChange={src => update(d => void (d.showcase.focal.src = src))}
          />
        </Field>
      </EditorCard>

      <EditorCard
        title="Grid thumbnails"
        description="The 8 cards surrounding the featured card. For the classic 3×3 look, keep 8."
      >
        <RepeatableList
          items={showcase.cards}
          onChange={cards => update(d => void (d.showcase.cards = cards))}
          newItem={(): ImageSlot => ({ label: "New thumbnail" })}
          addLabel="+ Add thumbnail"
          renderItem={(card, patch) => (
            <>
              <Field label="Label">
                <TextInput
                  value={card.label}
                  onChange={v => patch({ label: v })}
                />
              </Field>
              <Field label="Image">
                <ImageInput src={card.src} onChange={src => patch({ src })} />
              </Field>
            </>
          )}
        />
      </EditorCard>
    </div>
  );
}
