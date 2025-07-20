import { observer } from 'mobx-react-lite'
import { Flex } from '#/components/Flex'
import { Typography } from '#/styles/system'
import { ProgressionPanel } from '../chords/progression-panel'
import { styled } from 'styled-components'

const MidiGrid = styled.div`
	display: grid;
	grid-template-columns: 60px repeat(16, 1fr);
	grid-template-rows: repeat(15, 40px);
	gap: 1px;
	border: 1px solid var(--gray-6);
	background: var(--gray-2);
	padding: 8px;
	width: 100%;
	max-width: 1200px;
`

const ToneLabel = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--gray-4);
	font-weight: 600;
	font-size: 12px;
	color: var(--gray-12);
	border-radius: 2px;
`

const GridCell = styled.div<{ isActive?: boolean; beatIndex?: number }>`
	background: ${props => props.isActive ? 'var(--accent-9)' : 
		props.beatIndex !== undefined && props.beatIndex % 4 === 0 ? 'var(--gray-3)' : 'var(--gray-1)'};
	border: 1px solid var(--gray-5);
	border-radius: 2px;
	cursor: pointer;
	transition: all 0.1s ease;
	
	&:hover {
		background: ${props => props.isActive ? 'var(--accent-10)' : 'var(--accent-3)'};
		border-color: var(--accent-7);
	}
`

const TimeLabel = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	color: var(--gray-11);
	font-weight: 500;
`

type PatternsViewPropsT = {}

export const PatternsView = observer((props: PatternsViewPropsT) => {
	// Generate tone labels for T1-2 to T8+2 (5 octaves, 8 tones each)
	const toneLabels = []
	for (let octave = 2; octave >= -2; octave--) {
		for (let tone = 1; tone <= 8; tone++) {
			const suffix = octave === 0 ? '' : octave > 0 ? `+${octave}` : `${octave}`
			toneLabels.push(`T${tone}${suffix}`)
		}
	}

	// Generate 16 beat divisions (4 beats × 4 subdivisions)
	const beatDivisions = Array.from({ length: 16 }, (_, i) => i)

	const handleCellClick = (toneId: string, beatIndex: number) => {
		console.log('Cell clicked:', toneId, 'at beat', beatIndex)
		// TODO: Toggle pattern note, play preview
	}

	return (
		<Flex.Column className='PatternsView' height='100vh' maxHeight='100%' gap='4'>
			<PatternEditor toneLabels={toneLabels} beatDivisions={beatDivisions} onCellClick={handleCellClick} />
			<ProgressionPanel />
		</Flex.Column>
	)
})

type PatternEditorPropsT = {
	toneLabels: string[]
	beatDivisions: number[]
	onCellClick: (toneId: string, beatIndex: number) => void
}

const PatternEditor = observer((props: PatternEditorPropsT) => {
	return (
		<Flex.Column className='PatternEditor' gap='2' pl='4'>
			<Flex.Row className='patternControls' align='center' gap='2'>
				<Typography.Bold data-uppercase>PATTERNS</Typography.Bold>
			</Flex.Row>
			
			<MidiGrid>
				{/* Empty corner cell */}
				<div></div>
				
				{/* Time labels */}
				{props.beatDivisions.map((beat, index) => (
					<TimeLabel key={`time-${beat}`}>
						{Math.floor(beat / 4) + 1}.{(beat % 4) + 1}
					</TimeLabel>
				))}

				{/* Pattern grid rows */}
				{props.toneLabels.map((toneId) => (
					<>
						{/* Tone label */}
						<ToneLabel key={`label-${toneId}`}>
							{toneId}
						</ToneLabel>
						
						{/* Grid cells for this tone */}
						{props.beatDivisions.map((beatIndex) => (
							<GridCell
								key={`cell-${toneId}-${beatIndex}`}
								beatIndex={beatIndex}
								onClick={() => props.onCellClick(toneId, beatIndex)}
							/>
						))}
					</>
				))}
			</MidiGrid>
		</Flex.Column>
	)
})