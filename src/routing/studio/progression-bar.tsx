import { Flex } from '#/components/Flex'
import { observer } from 'mobx-react-lite'
import { $progression } from '#/stores/$progression'
import { $drog } from '#/stores/$drog'
import { Text } from '#/components/text'
import { Icon } from '@iconify/react'
import { IconButton } from '@radix-ui/themes'
import { appConfig } from '#/constants/appConfig'
import classNames from 'classnames'
import './progression-bar.css'
import { ProgressionChordSettingsMenuIcon } from './progression-chord-settings-menu'
import React from 'react'

const handleDrop = (event: React.DragEvent) => {
	event.preventDefault()
	if (!$drog.draggingItem) return

	const progressionArea = event.currentTarget
	const rect = progressionArea.getBoundingClientRect()
	const isInsideProgressionArea =
		event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom

	if (isInsideProgressionArea) {
		const chordData = $drog.draggingItem
		const stepData = {
			symbol: chordData.symbol,
			tonic: chordData.tonic,
			notes: chordData.notes,
			bassNote: chordData.bassNote,
			voicing: chordData.voicing,
			inversion: chordData.inversion,
			octave: chordData.octave,
			color: chordData.color,
			durationBeats: 4,
			isRest: false,
			minVelocity: 64,
			maxVelocity: 127,
		}

		$progression.addStep(stepData)
	}
}

const handleDragOver = (event: React.DragEvent) => {
	event.preventDefault()
}

const handleMouseUp = (event: React.MouseEvent) => {
	if (!$drog.draggingItem) return

	const progressionArea = event.currentTarget.querySelector('.progressionArea')
	if (!progressionArea) {
		$drog.clearDrag()
		return
	}

	const rect = progressionArea.getBoundingClientRect()
	const isInsideProgressionArea =
		event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom

	if (isInsideProgressionArea) {
		// Handle chord from browser
		if ($drog.draggingItem) {
			const chordData = $drog.draggingItem
			const stepData = {
				symbol: chordData.symbol,
				tonic: chordData.tonic,
				notes: chordData.notes,
				bassNote: chordData.bassNote,
				voicing: chordData.voicing,
				inversion: chordData.inversion,
				octave: chordData.octave,
				color: chordData.color,
				durationBeats: 4,
				isRest: false,
				minVelocity: 64,
				maxVelocity: 127,
			}
			$progression.addStep(stepData)
		}
	}

	$drog.clearDrag()
}

export const ProgressionBar = observer(() => {
	const isDragTarget = !!$drog.draggingItem
	const draggingColor = isDragTarget ? appConfig.rootNoteColors[$drog.draggingItem?.tonic] : null
	const draggingItemColor = $drog.draggingItem?.color
	const areaClasses = classNames('progressionArea', draggingItemColor, { isDragTarget })

	return (
		<Flex.Column className='ProgressionBar' onMouseUp={handleMouseUp} data-accent-color={draggingItemColor}>
			<Flex.Row className='top' py='4' px='4' justify='between' align='center'>
				<Flex.Row className='left'>
					<Text.p className='barTitle'>Progression</Text.p>
				</Flex.Row>
				<Flex.Row className='right' gap='4'>
					{$progression.selectedStepId && (
						<>
							<IconButton variant='ghost' onClick={$progression.moveSelectedStepLeft}>
								<Icon icon='fluent:caret-left-20-filled' />
							</IconButton>

							<IconButton variant='ghost' onClick={$progression.moveSelectedStepRight}>
								<Icon icon='fluent:caret-right-20-filled' />
							</IconButton>

							<IconButton variant='ghost' onClick={$progression.duplicateSelectedStep}>
								<Icon icon='fluent:copy-select-20-regular' />
							</IconButton>

							<IconButton variant='ghost' onClick={$progression.deleteSelectedStep}>
								<Icon icon='fluent:delete-20-regular' />
							</IconButton>
						</>
					)}
				</Flex.Row>
			</Flex.Row>
			<Flex.Row>
				<Flex.Row
					className={areaClasses}
					data-drag-color={draggingColor}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					style={{ position: 'relative' }}
				>
					{$progression.steps.map((step, index) => (
						<ProgressionStep key={step.id} step={step} />
					))}
				</Flex.Row>
			</Flex.Row>
		</Flex.Column>
	)
})

type ProgressionStepPropsT = {
	step: ProgressionStepT
}

const ProgressionStep = observer((props: ProgressionStepPropsT) => {
	if (props.step.isRest) return <ProgressionRest {...props} />
	const isSelected = $progression.checkIsSelectedId(props.step.id)
	const chord = props.step
	const classes = classNames('ProgressionStep', chord.color, {
		isSelected: isSelected,
	})

	const calculateWidth = () => {
		const totalBeatsInProgression = $progression.lengthBars * 4 // 4 beats per bar
		const stepWidthPercentage = (props.step.durationBeats / totalBeatsInProgression) * 100
		return `calc(${stepWidthPercentage}% - 5px)`
	}

	const width = calculateWidth()

	return (
		<Flex.Row
			align='center'
			py='2px'
			px='2'
			gap='2'
			justify='start'
			className={classes}
			data-accent-color={chord.color}
			style={{ width, maxWidth: width }}
			onClick={() => $progression.selectStep(chord.id)}
		>
			<Flex.Row gap='2'>
				<ProgressionChordSettingsMenuIcon chord={chord} />
			</Flex.Row>

			<Text.p className='symbol'>{props.step.symbol}</Text.p>
		</Flex.Row>
	)
})

const ProgressionRest = observer((props: ProgressionStepPropsT) => {
	const calculateWidth = () => {
		const totalBeatsInProgression = $progression.lengthBars * 4 // 4 beats per bar
		const stepWidthPercentage = (props.step.durationBeats / totalBeatsInProgression) * 100
		return `calc(${stepWidthPercentage}% - 5px)`
	}

	const width = calculateWidth()

	return (
		<Flex.Row align='center' p='2' className='ProgressionRest' data-accent-color='gray' style={{ width, maxWidth: width }}>
			<Icon icon='fluent:sleep-24-regular' />
		</Flex.Row>
	)
})

// const ProgressionRotator = () => {
// 	return (
// 		<Flex.Row className='progressionRotator'>
// 			<Text.p className='progressionName'>
// 				<span className='idValue'>{$progression.id}</span>
// 			</Text.p>
// 			<IconButton variant='ghost'>
// 				<Icon icon='fluent:caret-up-20-filled' />
// 			</IconButton>
// 			<IconButton variant='ghost'>
// 				<Icon icon='fluent:caret-down-20-filled' />
// 			</IconButton>
// 		</Flex.Row>
// 	)
// }
