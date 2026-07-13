import { useCms } from "../../../cms/ContentProvider";
import type { ImageSlot } from "../../../cms/content";
import {
  EditorCard,
  Field,
  ImageInput,
  RepeatableList,
  TextArea,
  TextInput,
} from "../fields";
import EditorHeader from "./EditorHeader";

export default function HeroEditor() {
  const { content, update } = useCms();
  const hero = content.hero;

  return (
    <div className="space-y-6">
      <EditorHeader title="Hero" anchor="/" />

      <EditorCard title="Headline">
        <Field label="Line 1" hint="regular weight">
          <TextInput
            value={hero.line1}
            onChange={v => update(d => void (d.hero.line1 = v))}
          />
        </Field>
        <Field label="Line 2" hint="pixel font">
          <TextInput
            value={hero.line2}
            onChange={v => update(d => void (d.hero.line2 = v))}
          />
        </Field>
        <Field label="Subtitle">
          <TextArea
            value={hero.subtitle}
            onChange={v => update(d => void (d.hero.subtitle = v))}
            rows={2}
          />
        </Field>
      </EditorCard>

      <EditorCard
        title="Fanned cards"
        description="The arc of cards under the headline. Each is a label + optional image."
      >
        <RepeatableList
          items={hero.cards}
          onChange={cards => update(d => void (d.hero.cards = cards))}
          newItem={(): ImageSlot => ({ label: "New card" })}
          addLabel="+ Add card"
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
