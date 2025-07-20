import './chord-card.css'
import React, { useId, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { Text } from '#/components/text'
import { useDatass } from 'datass'
import { theory } from '#/modules/theory'
import { appConfig } from '#/constants/appConfig'
import classNames from 'classnames'
import { Flex } from '#/components/Flex'
import { observer } from 'mobx-react-lite'
import { SettingsDropdown } from './chord-card-settings-menu'
import { $drog } from '#/stores/$drog'
import { action, observable } from 'mobx'
import { MiniChordCard } from '#/components'
import { ChordCardMini } from './chord-card-mini'

class ChordCardStore {
	@observable accessor id = crypto.randomUUID()
	@observable accessor symbol = ''
	@observable accessor tonic = ''
	@observable accessor notes = []

	@observable accessor bassNote = ''
	@observable accessor voicing = ''
	@observable accessor inversion = 0
	@observable accessor octave = 0
	color = ''

	constructor(symbol: string) {
		const chord = theory.getChord(symbol)
		this.color = chord.color
		this.bassNote = chord.tonic
		this.tonic = chord.tonic
		this.notes = chord.notes
		this.octave = 0
		this.inversion = 0
		this.voicing = 'closed'
		this.symbol = symbol
		return this
	}

	@action setOctave = (value) => {
		this.octave = value
	}

	@action setVoicing = (value) => {
		this.voicing = value
	}

	@action setInversion = (value) => {
		this.inversion = value
	}

	@action setBassNote = (value) => {
		this.bassNote = value
	}
}

const handleMouseDown = (id, chordData) => (event) => {
	event.preventDefault()
	const rect = event.currentTarget.getBoundingClientRect()
	const startX = event.clientX - rect.left
	const startY = event.clientY - rect.top
	const initialMouseX = event.clientX
	const initialMouseY = event.clientY

	let hasMovedEnough = false

	// Set grabbing cursor immediately
	document.body.style.cursor = 'grabbing'

	const handleMouseMove = (moveEvent) => {
		const distanceX = moveEvent.clientX - initialMouseX
		const distanceY = moveEvent.clientY - initialMouseY
		const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

		if (!hasMovedEnough && totalDistance > 10) {
			hasMovedEnough = true
			$drog.setDraggingItem(chordData)
		}

		if (hasMovedEnough) {
			const newX = moveEvent.clientX - startX
			const newY = moveEvent.clientY - startY
			$drog.setDragOffset({ x: newX, y: newY })
		}
	}

	const handleMouseUp = () => {
		document.body.style.cursor = ''
		$drog.setDraggingItem(null)
		$drog.setDragOffset({ x: 0, y: 0 })
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)
}

type PropsT = {
	symbol: string
}

export const ChordCard = observer((props: PropsT) => {
	const [chord] = useState(() => new ChordCardStore(props.symbol))
	const classes = classNames('ChordCard', chord.color)
	const isDragging = $drog.checkIsDraggingId(chord.id)
	const dragHandleRef = useRef(null)
	const onMouseDown = React.useMemo(() => handleMouseDown(chord.id, chord), [chord])

	return (
		<>
			<div className={classes} data-accent-color={chord.color}>
				<div className='RowContainer'>
					<Flex.Column style={{ justifyContent: 'space-between' }} className='LeftColumn'>
						<IconsRow data={chord} />
						<Flex.Row gap='1' align='center' className='ml-[-6px] text-xl font-bold'>
							<Icon
								ref={dragHandleRef}
								icon='stash:drag-squares-vertical-solid'
								className='dragHandle cursor-grab active:cursor-grabbing'
								onMouseDown={onMouseDown}
							/>
							{props.symbol}
						</Flex.Row>
						<NotesRow notes={chord.notes} />
					</Flex.Column>
					<Flex.Column align='end' style={{ justifyContent: 'space-between' }} className='RightColumn'>
						<InversionRow inversion={chord.inversion} />
						<OctaveRow octave={chord.octave} />
						<BassNoteRow tonic={chord.tonic} bassNote={chord.bassNote} />
						<VoicingRow voicing={chord.voicing} />
					</Flex.Column>
				</div>
			</div>

			{isDragging && <ChordCardMini />}
		</>
	)
})

const IconsRow = (props) => {
	return (
		<Flex.Row className='IconsRow flex gap-x-2'>
			<SettingsDropdown chord={props.data} />
			<Icon icon='mdi:refresh' />
			<Icon icon='mdi:delete' />
		</Flex.Row>
	)
}

const NotesRow = (props) => {
	return (
		<Flex.Row className='NotesRow fontSecondary text-sm flex gap-2'>
			{props.notes.map((note) => (
				<span key={note}>{note}</span>
			))}
		</Flex.Row>
	)
}

const InversionRow = (props) => {
	const opacityClass = props.inversion > 0 ? 'opacity-100' : 'opacity-0'

	return (
		<Flex.Row className={`InversionRow ${opacityClass}`}>
			INV
			<span className='value'>
				{props.inversion > 0 ? '+' : ''}
				{props.inversion}
			</span>
		</Flex.Row>
	)
}

const OctaveRow = (props) => {
	const opacityClass = props.octave > 0 ? 'opacity-100' : 'opacity-0'

	return (
		<Flex.Row className={`OctaveRow ${opacityClass}`}>
			OCT
			<span className='value'>
				{props.octave > 0 ? '+' : ''}
				{props.octave}
			</span>
		</Flex.Row>
	)
}

const BassNoteRow = (props) => {
	const opacityClass = props.bassNote !== props.tonic ? 'opacity-100' : 'opacity-0'
	return (
		<Flex.Row className={`BassNoteRow ${opacityClass}`}>
			BASS <span className='value'>{props.bassNote}</span>
		</Flex.Row>
	)
}

const VoicingRow = (props) => {
	const opacityClass = props.voicing !== 'closed' ? 'opacity-100' : 'opacity-0'
	return <div className={`VoicingRow uppercase ${opacityClass}`}>{props.voicing}</div>
}
