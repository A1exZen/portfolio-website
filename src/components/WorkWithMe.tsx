import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../cms/ContentProvider";

const field =
	"w-full rounded-2xl bg-black/[0.04] px-4 py-3.5 text-ink placeholder:text-ink/35 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-accent/40";

const projectTypes = [
	"Landing page",
	"Business website / store",
	"Web app / dashboard",
	"Mobile app",
	"Redesign of an existing product",
	"Something else",
];

const budgets = ["Under $1,000", "$1,000–3,000", "$3,000–8,000", "$8,000+", "Not sure yet"];

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The funnel's endpoint — a project brief form. Posts to /api/contact, a
 * Vercel edge function that relays the submission to Telegram (see
 * api/contact.ts). That endpoint only exists once deployed to Vercel — or
 * locally via `vercel dev` — so plain `npm run dev` will hit the error state.
 */
export default function WorkWithMe() {
	const { contact } = useContent();
	const socials = contact.socials;
	const [form, setForm] = useState({
		name: "",
		email: "",
		type: projectTypes[0],
		budget: budgets[budgets.length - 1],
		message: "",
		company: "", // honeypot — left empty by real visitors
	});
	const [status, setStatus] = useState<Status>("idle");

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("request failed");
			setStatus("sent");
		} catch {
			setStatus("error");
		}
	}

	const set =
		(k: keyof typeof form) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) =>
			setForm(f => ({ ...f, [k]: e.target.value }));

	const mailtoFallback = (() => {
		const subject = encodeURIComponent(`Project enquiry — ${form.type}`);
		const body = encodeURIComponent(
			`Project type: ${form.type}\nBudget: ${form.budget}\n\n${form.message}\n\n— ${form.name} (${form.email})`,
		);
		return `mailto:${contact.email}?subject=${subject}&body=${body}`;
	})();

	return (
		<section id="start-project" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-2xl px-6">
				<SectionHeading>Start Your Project</SectionHeading>

				<Reveal className="mt-12 text-center" direction="up">
					<p className="mx-auto max-w-lg text-lg text-ink/55">{contact.intro}</p>
					<p className="mx-auto mt-5 max-w-lg text-lg text-ink/55">
						Prefer another channel? Find me on{" "}
						{socials.map((s, i) => (
							<span key={s.label}>
								<a
									href={s.href}
									target="_blank"
									rel="noreferrer"
									className="font-semibold text-ink underline decoration-wavy decoration-1 underline-offset-4 transition-colors hover:text-accent"
								>
									{s.label}
								</a>
								{i < socials.length - 2
									? ", "
									: i === socials.length - 2
										? " or "
										: ""}
							</span>
						))}
						.
					</p>
				</Reveal>

				<Reveal className="mt-12" direction="up" delay={0.1}>
					<AnimatePresence mode="wait">
						{status === "sent" ? (
							<motion.div
								key="sent"
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
								className="rounded-3xl bg-cloud px-8 py-14 text-center"
							>
								<span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
									<CheckIcon />
								</span>
								<h3 className="mt-5 text-xl font-black tracking-tight text-ink">
									Brief sent
								</h3>
								<p className="mx-auto mt-2 max-w-sm text-ink/55">
									Thanks — I'll reply within 24 hours.
								</p>
							</motion.div>
						) : (
							<motion.form
								key="form"
								initial={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onSubmit={onSubmit}
								className="space-y-6"
							>
								{/* Honeypot — hidden from real visitors, bots that autofill
								    every field trip it and get silently dropped server-side. */}
								<input
									type="text"
									value={form.company}
									onChange={set("company")}
									tabIndex={-1}
									autoComplete="off"
									aria-hidden="true"
									className="absolute left-[-9999px] h-0 w-0 opacity-0"
								/>

								<div className="grid gap-6 sm:grid-cols-2">
									<Labeled label="Name">
										<input
											className={field}
											placeholder="Jane Smith"
											value={form.name}
											onChange={set("name")}
											required
										/>
									</Labeled>
									<Labeled label="Email">
										<input
											type="email"
											className={field}
											placeholder="jane@company.com"
											value={form.email}
											onChange={set("email")}
											required
										/>
									</Labeled>
								</div>

								<div className="grid gap-6 sm:grid-cols-2">
									<Labeled label="What do you need?">
										<select
											className={`${field} appearance-none`}
											value={form.type}
											onChange={set("type")}
										>
											{projectTypes.map(t => (
												<option key={t}>{t}</option>
											))}
										</select>
									</Labeled>
									<Labeled label="Budget" hint="(rough is fine)">
										<select
											className={`${field} appearance-none`}
											value={form.budget}
											onChange={set("budget")}
										>
											{budgets.map(b => (
												<option key={b}>{b}</option>
											))}
										</select>
									</Labeled>
								</div>

								<Labeled label="About your project">
									<textarea
										rows={5}
										className={`${field} resize-none`}
										placeholder="What are you building, who is it for, and when do you want to launch?"
										value={form.message}
										onChange={set("message")}
										required
									/>
								</Labeled>

								{status === "error" && (
									<p className="text-sm font-semibold text-red-600">
										Something went wrong sending that.{" "}
										<a href={mailtoFallback} className="underline">
											Email me directly
										</a>{" "}
										instead — sorry about that.
									</p>
								)}

								<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
									<p className="text-sm text-ink/45">
										I reply within 24 hours — no spam, no obligations.
									</p>
									<motion.button
										type="submit"
										disabled={status === "sending"}
										whileHover={{ scale: status === "sending" ? 1 : 1.04 }}
										whileTap={{ scale: status === "sending" ? 1 : 0.96 }}
										className="rounded-full bg-accent px-7 py-3.5 font-bold text-white shadow-lg transition-colors hover:bg-accent-strong disabled:opacity-60"
									>
										{status === "sending" ? "Sending…" : "Send project brief"}
									</motion.button>
								</div>
							</motion.form>
						)}
					</AnimatePresence>
				</Reveal>
			</div>
		</section>
	);
}

function Labeled({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block">
			<span className="mb-2 block text-sm font-bold text-ink">
				{label}
				{hint && <span className="ml-1.5 font-normal text-ink/40">{hint}</span>}
			</span>
			{children}
		</label>
	);
}

function CheckIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="m5 13 4 4L19 7"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
