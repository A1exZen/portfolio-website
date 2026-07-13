type Props = {
  /** Optional image src — when provided the placeholder shows a real image. */
  src?: string;
  alt?: string;
  /** Small centred label to hint what image belongs here. */
  label?: string;
  className?: string;
  rounded?: string;
  /** CSS object-position — lets a crop favour the meaningful part of a wide
   * screenshot instead of the geometric centre. */
  position?: string;
};

/**
 * A drop-in image slot. Renders a soft, shimmering grey card by default so the
 * whole layout reads correctly before real imagery exists — pass `src` later to
 * swap any slot for a real screenshot without touching the layout.
 */
export default function Placeholder({
  src,
  alt = "",
  label,
  className = "",
  rounded = "rounded-2xl",
  position = "center",
}: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ objectPosition: position }}
        className={`h-full w-full object-cover ${rounded} ${className}`}
      />
    );
  }

  return (
    <div
      className={`placeholder-fill grid h-full w-full place-items-center ring-1 ring-black/5 ${rounded} ${className}`}
      role="img"
      aria-label={label || "Image placeholder"}
    >
      {label && (
        <span className="pointer-events-none z-10 select-none text-xs font-semibold uppercase tracking-wider text-black/25">
          {label}
        </span>
      )}
    </div>
  );
}
