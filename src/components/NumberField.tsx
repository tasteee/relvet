import { IconButton, TextField } from '@radix-ui/themes'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Flex } from './Flex'
import { observer } from 'mobx-react-lite'

type PropsT = {
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	step?: number
}

export const NumberField = observer((props: PropsT) => {
	const handleDecrement = () => {
		const newValue = props.value - (props.step || 1)
		const minValue = props.min !== undefined ? props.min : Number.MIN_SAFE_INTEGER
		if (newValue >= minValue) {
			props.onChange(newValue)
		}
	}

	const handleIncrement = () => {
		const newValue = props.value + (props.step || 1)
		const maxValue = props.max !== undefined ? props.max : Number.MAX_SAFE_INTEGER
		if (newValue <= maxValue) {
			props.onChange(newValue)
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value)
		if (!isNaN(value)) {
			const minValue = props.min !== undefined ? props.min : Number.MIN_SAFE_INTEGER
			const maxValue = props.max !== undefined ? props.max : Number.MAX_SAFE_INTEGER
			const clampedValue = Math.max(minValue, Math.min(maxValue, value))
			props.onChange(clampedValue)
		}
	}

	return (
		<Flex.Row align='center' gap='1'>
			<IconButton
				size='1'
				variant='soft'
				onClick={handleDecrement}
				disabled={props.min !== undefined && props.value <= props.min}
			>
				<Icon icon='material-symbols:remove' width='12px' height='12px' />
			</IconButton>
			<TextField.Input
				type='number'
				value={props.value.toString()}
				onChange={handleInputChange}
				min={props.min}
				max={props.max}
				step={props.step || 1}
				style={{ width: '60px', textAlign: 'center' }}
			/>
			<IconButton
				size='1'
				variant='soft'
				onClick={handleIncrement}
				disabled={props.max !== undefined && props.value >= props.max}
			>
				<Icon icon='material-symbols:add' width='12px' height='12px' />
			</IconButton>
		</Flex.Row>
	)
})