import { motion } from "motion/react";
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

/**
 * The funnel's endpoint — a project brief form. Submits via mailto so the
 * static site needs no backend; swap `onSubmit` for a form service (Formspree
 * etc.) when one is set up.
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
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const subject = encodeURIComponent(`Project enquiry — ${form.type}`);
		const body = encodeURIComponent(
			`Project type: ${form.type}\nBudget: ${form.budget}\n\n${form.message}\n\n— ${form.name} (${form.email})`,
		);
		window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
	}

	const set =
		(k: keyof typeof form) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) =>
			setForm(f => ({ ...f, [k]: e.target.value }));

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
					<form onSubmit={onSubmit} className="space-y-6">
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

						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
							<p className="text-sm text-ink/45">
								I reply within 24 hours — no spam, no obligations.
							</p>
							<motion.button
								type="submit"
								whileHover={{ scale: 1.04 }}
								whileTap={{ scale: 0.96 }}
								className="rounded-full bg-accent px-7 py-3.5 font-bold text-white shadow-lg transition-colors hover:bg-accent-strong"
							>
								Send project brief
							</motion.button>
						</div>
					</form>
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
