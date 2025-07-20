type WithoutT<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P]
}

type SignalMapT = Record<string, SignalT>
type ToneMapT = Record<string, ToneT>

// inversions: +1 would mean rotated notes up one, so the bassNote would now be the 2nd note of the chord, rather than the first. When you go up X amount of inversions as there are notes in your chord, you wind up back at the same original notes, but an octave up.
// voicings: ways to arrange chord notes, from closed (standard, close as possible) to spread wide across octaves. can be useful for eliminating mud. makes interesting sounds of same chords.
type VoicingT =
	| 'open'
	| 'closed'
	| 'drop2'
	| 'drop3'
	| 'drop2and4'
	| 'rootless'
	| 'spread'
	| 'cluster'
	| 'shell'
	| 'pianistic'
	| 'guitaristic'
	| 'orchestral'

// A ChordT is a wild, un-commited-to chord that the user can preview,
// modify, and optionally add to their progression if they like it.
// When a ChordT is added to a progression, it just evolves into a
// ProgressionChordT, which is a more concrete version of the chord
// that has a duration and is marked as not a rest.
type ChordT = {
	id: string
	symbol: string
	bassNote: string
	tonic: string
	inversion: number
	voicing: VoicingT | string
	octave: number
	color?: string
	notes: string[]
	adjustedNotes: string[]
	minVelocity: number
	maxVelocity: number
}

type ProgressionChordT = ChordT & {
	durationBeats: number
	isRest: boolean
}

type ProgressionRestT = ProgressionChordT & {
	isRest: boolean
	symbol: 'Rest'
	color: 'gray'
}

type ProgressionStepT = ProgressionChordT | ProgressionRestT
type PartialStepWithIdT = Partial<ProgressionStepT> & { id: string }
type PartialStepT = Partial<ProgressionStepT>

type ProgressionT = {
	id: string
	bpm: number
	lengthBars: number
	steps: ProgressionStepT[]
}

// A tone is a placeholder for a note that is not known at this time.
// T1 will map to the 1st note of a chord when the pattern is applied
// to that chord. T1-2 will map to the 1st note of a chord, 2 octaves down.
// T1+1 will map to the 1st note of a chord, 1 octave up. Tones go from
// T1-2 to T8+2, 8 tones per octave, 5 octaves total. T1-2 to T8-2,
// T1-1 to T8-1, T1 to T8, T1+1 to T8+1, and T1+2 to T8+2.
type ToneT = {
	id: string
	index: number
	octave: number
	totalIndex: number
	signalIds: string[]
}

// A signal is like a midi note, and it corresponds to a toneId rather
// than a specific note. So like T4+1 (4th note of a chord, 1 octave up)
// rather than like C#5, because the pattern is being created to be applied
// to any chord a user could throw at it in the future. Signals are sent
// to the midi engine, along with the progression, and the midi engine
// derives actual midi notes by mapping the signal's toneId to the
// corresponding note of the chord in the progression.
type SignalT = {
	id: string
	toneId: string
	startDivisions: number
	endDivisions: number
	durationDivisions: number
	minVelocity: number
	maxVelocity: number
}

type MidiSignalT = {
	id: string
	note: number
	startTicks: number
	endTicks: number
	velocity: number
}

type PatternT = {
	id: string
	title: string
	description: string
	tags: string[]
	strategy: 'cycling'
	lengthBars: number
	signals: Record<string, SignalT>
	tones: Record<string, ToneT>
}

type ProjectT = {
	id: string
	title: string
	description: string
	tags: string[]
	userId: string
	createdAt: string
	updatedAt: string
	patterns: PatternT[]
	progressions: ProgressionT[]
}

// Generic common props that can be used with any HTML element
type CommonPropsT<TElement = HTMLDivElement> = {
	className?: string
	style?: React.CSSProperties
	children?: React.ReactNode
	id?: string
	'data-testid'?: string
	onClick?: React.MouseEventHandler<TElement>
	onMouseEnter?: React.MouseEventHandler<TElement>
	onMouseLeave?: React.MouseEventHandler<TElement>
	onFocus?: React.FocusEventHandler<TElement>
	onBlur?: React.FocusEventHandler<TElement>
	onKeyDown?: React.KeyboardEventHandler<TElement>
	onKeyUp?: React.KeyboardEventHandler<TElement>
	onContextMenu?: (event: React.MouseEvent<TElement>) => void
	onDragStart?: (event: React.DragEvent<TElement>) => void
	onDragEnd?: (event: React.DragEvent<TElement>) => void
	onDragOver?: (event: React.DragEvent<TElement>) => void
	onDragEnter?: (event: React.DragEvent<TElement>) => void
	onDragLeave?: (event: React.DragEvent<TElement>) => void
	onDrop?: (event: React.DragEvent<TElement>) => void
	onScroll?: (event: React.UIEvent<TElement>) => void
	onTouchStart?: (event: React.TouchEvent<TElement>) => void
	onTouchEnd?: (event: React.TouchEvent<TElement>) => void
	onTouchMove?: (event: React.TouchEvent<TElement>) => void
	onTouchCancel?: (event: React.TouchEvent<TElement>) => void
	onMouseDown?: (event: React.MouseEvent<TElement>) => void
	onMouseUp?: (event: React.MouseEvent<TElement>) => void
	onMouseMove?: (event: React.MouseEvent<TElement>) => void
	onMouseOut?: (event: React.MouseEvent<TElement>) => void
	onMouseOver?: (event: React.MouseEvent<TElement>) => void
	onSelect?: (event: React.SyntheticEvent<TElement>) => void
	onCopy?: (event: React.ClipboardEvent<TElement>) => void
	onCut?: (event: React.ClipboardEvent<TElement>) => void
	onPaste?: (event: React.ClipboardEvent<TElement>) => void
	onAnimationStart?: (event: React.AnimationEvent<TElement>) => void
	onAnimationEnd?: (event: React.AnimationEvent<TElement>) => void
	onAnimationIteration?: (event: React.AnimationEvent<TElement>) => void
	onTransitionEnd?: (event: React.TransitionEvent<TElement>) => void
	onWheel?: (event: React.WheelEvent<TElement>) => void
	onFocusCapture?: (event: React.FocusEvent<TElement>) => void
	onBlurCapture?: (event: React.FocusEvent<TElement>) => void
	onKeyDownCapture?: (event: React.KeyboardEvent<TElement>) => void
}

// Specific common props for different elements
type DivPropsT = CommonPropsT<HTMLDivElement>
type ButtonPropsT = CommonPropsT<HTMLButtonElement>
type InputPropsT = CommonPropsT<HTMLInputElement>
type SpanPropsT = CommonPropsT<HTMLSpanElement>
type AnchorPropsT = CommonPropsT<HTMLAnchorElement>

// For form elements that need onChange
type FormElementPropsT<TElement = HTMLInputElement> = CommonPropsT<TElement> & {
	onChange?: React.ChangeEventHandler<TElement>
	onSubmit?: React.FormEventHandler<HTMLFormElement>
}
