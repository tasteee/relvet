import { useId, useEffect, useState } from 'react'
import { Select } from '@radix-ui/themes'
import { useDatass } from 'datass'
import { observer } from 'mobx-react-lite'
import { $store } from './store'

type PropsT = {}

export const ScaleTypeSelect = observer((props: PropsT) => {
	const id = useId()
	const entries = Object.entries(scaleTypes)

	const handleChange = (value: string) => {
		$store.setScaleType(value)
	}

	const options = entries.map(([key, value]) => (
		<Select.Item key={key} value={key}>
			{value}
		</Select.Item>
	))

	return (
		<Select.Root value={$store.scaleType} onValueChange={handleChange}>
			<Select.Trigger />
			<Select.Content>{options}</Select.Content>
		</Select.Root>
	)
})

const scaleTypes = {
	Major: 'Major',
	Minor: 'Minor',
	Chromatic: 'Chromatic',
	Pentatonic: 'Pentatonic',
	'Whole Tone': 'Whole Tone',
	Blues: 'Blues',
	Dorian: 'Dorian',
	Mixolydian: 'Mixolydian',
	Lydian: 'Lydian',
	Phrygian: 'Phrygian',
	Locrian: 'Locrian',
	'Harmonic Minor': 'Harmonic Minor',
	'Melodic Minor': 'Melodic Minor',
	Augmented: 'Augmented',
	Diminished: 'Diminished',
	Arabic: 'Arabic',
	Hungarian: 'Hungarian',
	Neapolitan: 'Neapolitan',
	'Lydian Dominant': 'Lydian Dominant',
	'Double Harmonic': 'Double Harmonic',
	Bebop: 'Bebop',
	'Jazz Minor': 'Jazz Minor',
	Altered: 'Altered',
}
