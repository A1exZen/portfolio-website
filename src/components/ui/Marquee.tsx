import Badge from "./Badge";

type Props = {
  items: string[];
  direction?: "left" | "right";
  durationSec?: number;
  className?: string;
};

/**
 * Infinite auto-scrolling row of chips. Pauses on hover (CSS
 * animation-play-state, so it's free) and respects prefers-reduced-motion
 * via the global `* { animation-duration }` override in index.css.
 */
export default function Marquee({
  items,
  direction = "left",
  durationSec = 26,
  className = "",
}: Props) {
  const track = [...items, ...items, ...items];
  const animation =
    direction === "left"
      ? `marquee-left ${durationSec}s linear infinite`
      : `marquee-right ${durationSec}s linear infinite`;

  return (
    <div className={`group overflow-hidden ${className}`}>
      <div
        className="flex w-max gap-2.5 group-hover:[animation-play-state:paused]"
        style={{ animation }}
      >
        {track.map((t, i) => (
          <Badge key={i} tone="neutral" className="shrink-0">
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}
