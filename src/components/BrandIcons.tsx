/**
 * Small app-icon style brand marks used in the Background section.
 * Rounded-square tiles with a soft shadow, matching the reference layout.
 */

export function FigmaIcon() {
	return (
		<span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-[#1e1e1e] shadow-md">
			<svg width="26" height="26" viewBox="0 0 38 57" aria-label="Figma">
				<path
					fill="#1abcfe"
					d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"
				/>
				<path
					fill="#0acf83"
					d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z"
				/>
				<path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
				<path
					fill="#f24e1e"
					d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z"
				/>
				<path
					fill="#a259ff"
					d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z"
				/>
			</svg>
		</span>
	);
}

export function ReactIcon() {
	return (
		<span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-[#111827] shadow-md">
			<svg width="28" height="28" viewBox="0 0 24 24" aria-label="React">
				<g fill="none" stroke="#61dafb" strokeWidth="1.4">
					<ellipse cx="12" cy="12" rx="10" ry="4.2" />
					<ellipse
						cx="12"
						cy="12"
						rx="10"
						ry="4.2"
						transform="rotate(60 12 12)"
					/>
					<ellipse
						cx="12"
						cy="12"
						rx="10"
						ry="4.2"
						transform="rotate(120 12 12)"
					/>
				</g>
				<circle cx="12" cy="12" r="2" fill="#61dafb" />
			</svg>
		</span>
	);
}

export function NotionIcon() {
	return (
		<span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-white ring-1 ring-black/10 shadow-md">
			<img src="/images/notion.png" alt="Notion" width="28" height="28" />
		</span>
	);
}
