import type { MotionValue } from 'motion/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useContent } from '../cms/ContentProvider'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/**
 * How I think about the work. The statement lights up word by word as you
 * scroll through it, so it reads at the pace of the page, then two cards
 * expand on it. The second card is filled blue to give the row a focal point.
 */
export default function Philosophy() {
	const { philosophy } = useContent()
	return (
		<section
			id="philosophy"
			className="bg-white py-24 sm:py-32"
		>
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>My Philosophy</SectionHeading>

				<ScrollLitText
					text={philosophy.statement}
					className="mx-auto mt-16 max-w-5xl text-center text-[clamp(2rem,5.2vw,3.75rem)] font-black leading-[1.05] tracking-tight text-ink sm:mt-20"
				/>

				<div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 sm:mt-24">
					{philosophy.cards.map((c, i) => {
						const filled = i % 2 === 1
						return (
							<Reveal
								key={c.title}
								direction="up"
								delay={i * 0.1}
							>
								<motion.div
									whileHover={{ y: -8, rotate: filled ? 1 : -1 }}
									transition={{ type: 'spring', stiffness: 260, damping: 20 }}
									className={`flex h-full flex-col rounded-3xl p-8 sm:p-10 ${
										filled
											? 'bg-accent-deep text-white shadow-[0_24px_60px_rgba(22,96,232,0.28)]'
											: 'bg-cloud text-ink ring-1 ring-black/5'
									}`}
								>
									<span
										aria-hidden
										className={`font-pixel text-5xl font-bold leading-none ${
											filled ? 'text-white/40' : 'text-accent'
										}`}
									>
										&ldquo;
									</span>
									<h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
										{c.title}
									</h3>
									<p
										className={`mt-4 text-lg leading-relaxed ${
											filled ? 'text-white/85' : 'text-ink/65'
										}`}
									>
										{c.body}
									</p>
								</motion.div>
							</Reveal>
						)
					})}
				</div>
			</div>
		</section>
	)
}

/** A paragraph whose words fade from faint to solid as it crosses the viewport. */
function ScrollLitText({
	text,
	className
}: {
	text: string
	className: string
}) {
	const ref = useRef<HTMLParagraphElement>(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0.85', 'end 0.45']
	})
	const words = text.split(' ')
	return (
		<p
			ref={ref}
			className={className}
		>
			{words.map((w, i) => (
				<Word
					key={i}
					progress={scrollYProgress}
					range={[i / words.length, (i + 1) / words.length]}
				>
					{w}
				</Word>
			))}
		</p>
	)
}

function Word({
	progress,
	range,
	children
}: {
	progress: MotionValue<number>
	range: [number, number]
	children: string
}) {
	const opacity = useTransform(progress, range, [0.14, 1])
	return (
		<>
			<motion.span style={{ opacity }}>{children}</motion.span>{' '}
		</>
	)
}
