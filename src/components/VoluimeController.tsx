import { Slider } from '#/components/ui/slider'
import { $output } from '#/stores/$output'
import { just } from '#/modules/just'
import { observer } from 'mobx-react-lite'
import { Popover, IconButton } from '@radix-ui/themes'
import { Icon } from '@iconify/react'
import { useState, useCallback, useMemo } from 'react'

type PropsT = {
	variant?: 'soft' | 'solid' | 'outline' | 'ghost'
	size?: '1' | '2' | '3' | '4'
}

export const VolumeController = observer((props: PropsT) => {
	const currentVolumePercent = Math.round($output.volume * 100)
	const [sliderValue, setSliderValue] = useState([currentVolumePercent])

	const throttledVolumeUpdate = useMemo(() => {
		return just.throttle(50, (value: number) => {
			$output.setVolume(value / 100)
		})
	}, [])

	const handleVolumeChange = useCallback(
		(newValues: number[]) => {
			const rawValue = newValues[0]
			const snappedValue = Math.round(rawValue / 5) * 5
			setSliderValue([snappedValue])
			throttledVolumeUpdate(snappedValue)
		},
		[throttledVolumeUpdate]
	)

	const getVolumeIcon = () => {
		if ($output.isMuted || currentVolumePercent === 0) {
			return 'fluent:speaker-mute-20-filled'
		}
		if (currentVolumePercent < 33) {
			return 'fluent:speaker-0-20-filled'
		}
		if (currentVolumePercent < 66) {
			return 'fluent:speaker-1-20-filled'
		}
		return 'fluent:speaker-2-20-filled'
	}

	return (
		<Popover.Root>
			<Popover.Trigger>
				<IconButton variant={props.variant || 'ghost'} size={props.size || '2'}>
					<Icon icon={getVolumeIcon()} width='16' height='16' />
				</IconButton>
			</Popover.Trigger>
			<Popover.Content width='80px' size='1'>
				<div className='flex h-32 flex-col items-center justify-center gap-2 p-2'>
					<div className='text-xs text-center font-medium'>{sliderValue[0]}%</div>
					<Slider
						className='data-[orientation=vertical]:min-h-0'
						value={sliderValue}
						onValueChange={handleVolumeChange}
						min={0}
						max={100}
						step={5}
						orientation='vertical'
						aria-label='Volume slider'
					/>
				</div>
			</Popover.Content>
		</Popover.Root>
	)
})
