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
const STEP_HEIGHT = 48
const BEATS_PER_BAR = 4
const DIVISIONS_BAR_HEIGHT = 8
const CANVAS_HEIGHT = STEP_HEIGHT + DIVISIONS_BAR_HEIGHT
const BEAT_DIVISION_WIDTH = BEAT_WIDTH / 4

export const ProgressionPanel = observer(() => {
	const totalBeats = $store.totalBeats || 16
	const canvasWidth = totalBeats * BEAT_WIDTH

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'copy'
	}

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault()
		try {
			const chordData = JSON.parse(event.dataTransfer.getData('application/json'))
			if (chordData && chordData.symbol) {
				$store.addChordToProgression(chordData)
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
					border: '2px dashed var(--gray-6)', 
					borderRadius: '4px', 
					padding: '4px',
					background: 'var(--gray-1)'
				}}
			>
				<Stage width={canvasWidth} height={CANVAS_HEIGHT} className='progressionCanvas'>
					<ProgressionBackground />
					<Layer>
						<ProgressionSteps />
					</Layer>
				</Stage>
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

	return $store.steps.map((step) => {
		const width = step.durationBeats * BEAT_WIDTH
		const rect = (
			<Group key={step.id} onClick={() => $store.selectStep(step.id)}>
				<Rect
					x={x}
					y={20}
					width={width}
					height={60}
					fill={step.isRest ? '#666' : step.color || 'white'}
					cornerRadius={4}
					stroke={$store.selectedStepId === step.id ? '#fff' : undefined}
					strokeWidth={2}
				/>
				<KonvaText x={x + 6} y={40} text={step.symbol} fill='#000' fontSize={14} fontStyle='bold' />
			</Group>
		)

		x += width
		return rect
	})
}
