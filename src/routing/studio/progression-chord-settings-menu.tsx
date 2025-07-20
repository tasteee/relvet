import { Flex } from '#/components/Flex'
import { Text } from '#/components/text'
import { IconButton } from '@radix-ui/themes'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { Icon } from '@iconify/react'
import { observer } from 'mobx-react-lite'
import { DropdownMenu, Select } from '@radix-ui/themes'
import { NumberField, Input, Button, Group } from 'react-aria-components'
import { $progression } from '#/stores/$progression'

const VOICINGS = ['closed', 'open', 'drop2', 'drop3', 'drop2and4', 'rootless', 'spread', 'cluster']

export const ProgressionChordSettingsMenuIcon = observer((props: any) => {
	const availableNotes = props.chord.notes

	const handleOctaveChange = (value: number) => {
		$progression.updateStep({ id: props.chord.id, octave: value })
	}

	const handleInversionChange = (value: number) => {
		$progression.updateStep({ id: props.chord.id, inversion: value })
	}

	const handleVoicingChange = (value: string) => {
		$progression.updateStep({ id: props.chord.id, voicing: value as VoicingT })
	}

	const handleBassNoteChange = (value: string) => {
		$progression.updateStep({ id: props.chord.id, bassNote: value })
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<IconButton asChild variant='ghost' color='gray' className='settingsIconButton'>
					<Icon icon='solar:settings-linear' color='white' />
				</IconButton>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content className='min-w-[220px] rounded-xs'>
				<Flex.Column p='2' gap='2' className='innerColumn'>
					<Flex.Row justify='between' align='center' className='OctaveMenuRow'>
						<span className='text-sm font-medium'>Octave</span>
						<NumberField value={props.chord.octave} onChange={handleOctaveChange} minValue={-4} maxValue={4} aria-label='Octave'>
							<Group className='border-input data-focus-within:border-ring data-focus-within:ring-ring/50 relative inline-flex h-8 w-24 items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-focus-within:ring-[2px]'>
								<Button
									slot='decrement'
									className='border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border text-sm transition-[color,box-shadow]'
								>
									<MinusIcon size={12} aria-hidden='true' />
								</Button>
								<Input className='bg-background text-foreground w-full grow px-2 py-1 text-center tabular-nums' />
								<Button
									slot='increment'
									className='border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow]'
								>
									<PlusIcon size={12} aria-hidden='true' />
								</Button>
							</Group>
						</NumberField>
					</Flex.Row>

					{/* Inversion Row */}
					<Flex.Row justify='between' align='center' className='InversionMenuRow'>
						<span className='text-sm font-medium'>Inversion</span>
						<NumberField value={props.chord.inversion} onChange={handleInversionChange} minValue={-3} maxValue={3} aria-label='Inversion'>
							<Group className='border-input data-focus-within:border-ring data-focus-within:ring-ring/50 relative inline-flex h-8 w-24 items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-focus-within:ring-[2px]'>
								<Button
									slot='decrement'
									className='border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border text-sm transition-[color,box-shadow]'
								>
									<MinusIcon size={12} aria-hidden='true' />
								</Button>
								<Input className='bg-background text-foreground w-full grow px-2 py-1 text-center tabular-nums' />
								<Button
									slot='increment'
									className='border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow]'
								>
									<PlusIcon size={12} aria-hidden='true' />
								</Button>
							</Group>
						</NumberField>
					</Flex.Row>

					{/* Voicing Row */}
					<Flex.Row justify='between' align='center' className='VoicingMenuRow'>
						<span className='text-sm font-medium'>Voicing</span>

						<Select.Root value={props.chord.voicing} onValueChange={handleVoicingChange}>
							<Select.Trigger aria-label='Select voicing type' />
							<Select.Content>
								<Select.Group>
									{VOICINGS.map((option) => (
										<Select.Item key={option} value={option}>
											{option}
										</Select.Item>
									))}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Flex.Row>

					{/* Bass Note Row */}
					<Flex.Row className='BassNoteMenuRow' justify='between' align='center' aria-label='Bass Note'>
						<span className='text-sm font-medium'>Bass Note</span>

						<Select.Root value={props.chord.bassNote} onValueChange={handleBassNoteChange}>
							<Select.Trigger aria-label='Select bass note' />
							<Select.Content>
								<Select.Group>
									{availableNotes.map((note) => (
										<Select.Item key={note} value={note}>
											{note}
										</Select.Item>
									))}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Flex.Row>
				</Flex.Column>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	)
})
