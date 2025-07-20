import { Stage, Layer, Rect, Line, Text as KonvaText, Group } from 'react-konva'
import { observer } from 'mobx-react-lite'
import { Flex } from '#/components/Flex'
import { Typography } from '#/styles/system'
import { $store } from './store'
import { cssVarVal } from '#/modules/cssVarVal'
import { IconButton } from '@radix-ui/themes'
import { Icon } from '@iconify/react/dist/iconify.js'
import { $output } from '#/stores/$output'

const BEAT_WIDTH = 40
const STEP_HEIGHT = 60
const BEATS_PER_BAR = 4
const DIVISIONS_BAR_HEIGHT = 12
const CANVAS_HEIGHT = STEP_HEIGHT + DIVISIONS_BAR_HEIGHT
const BEAT_DIVISION_WIDTH = BEAT_WIDTH / 4

export const ProgressionPanel = observer(() => {
	const totalBeats = $store.totalBeats || 16
	const canvasWidth = totalBeats * BEAT_WIDTH

	const handleDragOver = (event: React.DragEvent) => {
		console.log('Drag over event triggered')
		event.preventDefault()
		event.dataTransfer.dropEffect = 'copy'
	}

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault()
		try {
			const chordData = JSON.parse(event.dataTransfer.getData('application/json'))
			console.log('Drop received:', chordData)
			if (chordData && chordData.symbol) {
				$store.addChordToProgression(chordData)
				console.log('Chord added to store, total steps:', $store.steps.length)
			}
		} catch (error) {
			console.error('Error parsing dropped chord data:', error)
		}
	}

	return (
		<Flex.Column className='ProgressionPanel' gap='2'>
			<Flex.Row className='topRow' justify='between'>
				<Typography.Bold data-uppercase>Progression</Typography.Bold>

				<Flex.Row className='actions' gap='2'>
					<IconButton size='1' onClick={() => $output.engine.play()}>
						<Icon icon='material-symbols:play-arrow' width='16px' height='16px' />
					</IconButton>
					<IconButton size='1' onClick={() => $output.engine.stop()}>
						<Icon icon='material-symbols:stop' width='16px' height='16px' />
					</IconButton>
					<IconButton size='1'>
						<Icon icon='material-symbols:loop' width='16px' height='16px' />
					</IconButton>
					<IconButton size='1'>
						<Icon icon='vaadin:caret-left' width='16px' height='16px' />
					</IconButton>
					<IconButton size='1'>
						<Icon icon='vaadin:caret-right' width='16px' height='16px' />
					</IconButton>
					<IconButton size='1'>
						<Icon icon='famicons:trash-sharp' width='16px' height='16px' />
					</IconButton>
				</Flex.Row>
			</Flex.Row>

			<div 
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				style={{ 
					border: '1px solid var(--gray-7)', 
					borderRadius: '8px', 
					padding: '8px',
					background: 'var(--gray-2)',
					minHeight: '80px',
					display: 'flex',
					alignItems: 'center',
					position: 'relative'
				}}
			>
				<Stage width={canvasWidth} height={CANVAS_HEIGHT} className='progressionCanvas' style={{ border: '1px solid red' }}>
					<ProgressionBackground />
					<Layer>
						<ProgressionSteps />
					</Layer>
				</Stage>
				{/* Drop zone overlay for better drag and drop UX */}
				{$store.steps.length === 0 && (
					<div 
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							color: 'var(--gray-9)',
							fontSize: '14px',
							pointerEvents: 'none',
							textAlign: 'center'
						}}
					>
						Drag chords here to build your progression
					</div>
				)}
			</div>
		</Flex.Column>
	)
})

const ProgressionBackground = observer(() => {
	const totalBeats = $store.totalBeats || 16

	return (
		<>
			<Layer>
				{[...Array(Math.ceil(totalBeats / BEATS_PER_BAR))].map((_, index) => (
					<BackgroundBar index={index} key={index} />
				))}

				{[...Array(totalBeats)].map((_, beatIdx) => (
					<BeatLine key={`beat-${beatIdx}`} index={beatIdx} />
				))}
			</Layer>
			<Layer>
				{[...Array(totalBeats * 4)].map((_, index) => (
					<BeatTick key={`tick-${index}`} index={index} />
				))}
			</Layer>
		</>
	)
})

const BackgroundBar = (props) => {
	const slate2 = cssVarVal('--slate-9')
	const slate3 = cssVarVal('--slate-12')
	const isEven = props.index % 2 === 0
	const fillColor = isEven ? slate2 : slate3
	const x = props.index * BEATS_PER_BAR * BEAT_WIDTH
	return <Rect y={DIVISIONS_BAR_HEIGHT} x={x} width={BEATS_PER_BAR * BEAT_WIDTH} height={STEP_HEIGHT} fill={fillColor} />
}

const BeatLine = (props) => {
	const slate4 = cssVarVal('--slate-4')
	const startPoint = props.index * BEAT_WIDTH
	return <Line points={[startPoint, DIVISIONS_BAR_HEIGHT, startPoint, STEP_HEIGHT + DIVISIONS_BAR_HEIGHT]} stroke={slate4} strokeWidth={1} />
}

const BeatTick = (props) => {
	const slate3 = cssVarVal('--slate-3')
	const x = props.index * BEAT_DIVISION_WIDTH
	return <Line points={[x, 0, x, DIVISIONS_BAR_HEIGHT]} stroke={slate3} strokeWidth={0.5} />
}

const ProgressionSteps = () => {
	let x = 0

	console.log('ProgressionSteps rendering, steps:', $store.steps.length, $store.steps)

	return $store.steps.map((step, index) => {
		const width = step.durationBeats * BEAT_WIDTH
		const chordHeight = STEP_HEIGHT - 4 // Leave some padding
		
		console.log(`Rendering chord ${index}:`, step.symbol, 'at x:', x, 'width:', width, 'height:', chordHeight)
		
		const rect = (
			<Group key={step.id} onClick={() => $store.selectStep(step.id)}>
				<Rect
					x={x}
					y={DIVISIONS_BAR_HEIGHT + 2}
					width={width}
					height={chordHeight}
					fill={step.isRest ? '#666' : step.color || '#10b981'}
					cornerRadius={4}
					stroke={$store.selectedStepId === step.id ? '#fff' : '#6b7280'}
					strokeWidth={$store.selectedStepId === step.id ? 2 : 1}
				/>
				<KonvaText 
					x={x + 6} 
					y={DIVISIONS_BAR_HEIGHT + 16} 
					text={step.symbol} 
					fill={step.isRest ? '#fff' : '#000'} 
					fontSize={12} 
					fontFamily='Arial'
				/>
			</Group>
		)

		x += width
		return rect
	})
}
