import { useId, useEffect, useState } from 'react'
import { OverlayLabel, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { $store } from './store'
import { observer } from 'mobx-react-lite'

type PropsT = {}

export const ScaleRootNoteSelect = observer((props: PropsT) => {
	const id = useId()
	const entries = Object.entries(rootNotes)

	const handleChange = (value: string) => {
		$store.setRootNote(value)
	}

	const options = entries.map(([key, value]) => (
		<SelectItem key={key} value={key}>
			{value}
		</SelectItem>
	))

	return (
		<div className='relative' style={{ width: 120 }}>
			<div className='group relative'>
				<OverlayLabel htmlFor={id}>Root Note</OverlayLabel>
				<Select value={$store.rootNote} onValueChange={handleChange}>
					<SelectTrigger id={id} className='bg-background'>
						<SelectValue placeholder='Select Root Note' />
					</SelectTrigger>
					<SelectContent>{options}</SelectContent>
				</Select>
			</div>
		</div>
	)
})

const rootNotes = {
	C: 'C',
	'C#': 'C#',
	D: 'D',
	'D#': 'D#',
	E: 'E',
	F: 'F',
	'F#': 'F#',
	G: 'G',
	'G#': 'G#',
	A: 'A',
	'A#': 'A#',
	B: 'B',
}
