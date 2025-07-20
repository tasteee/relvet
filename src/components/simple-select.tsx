import React, { useId } from 'react'
import { Select } from '@radix-ui/themes'
import { observer } from 'mobx-react-lite'

type PropsT = {
	options: Record<string, string> | string[]
	onChange: (value: string) => void
	value: string
}

export const SimpleSelect = observer((props: PropsT) => {
	const id = useId()

	const entries = React.useMemo(() => {
		const isArray = Array.isArray(props.options)
		const optionsArray = props.options as string[]
		if (isArray) return optionsArray.map((value, index) => [index.toString(), value])
		const optionsEntries = Object.entries(props.options)
		return optionsEntries
	}, [props.options])

	const options = entries.map(([key, value]) => (
		<Select.Item key={key} value={key}>
			{value}
		</Select.Item>
	))

	return (
		<Select.Root value={props.value} onValueChange={props.onChange}>
			<Select.Trigger />
			<Select.Content>{options}</Select.Content>
		</Select.Root>
	)
})
