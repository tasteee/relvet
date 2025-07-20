import './chords.css'
import { Popover } from 'radix-ui'
import { Flex } from '#/components/Flex'
import { IconButton, ScrollArea } from '@radix-ui/themes'
import { observer } from 'mobx-react-lite'
import { $store } from './store'
import { Icon } from '@iconify/react/dist/iconify.js'
import { ProgressionPanel } from './progression-panel'
import { styled } from 'styled-components'
import { SimpleSelect } from '#/components/simple-select'
import classNames from 'classnames'
import { useDatass } from 'datass'
import './popover.css'
import { Typography } from '#/styles/system'
import { ROOT_NOTES, SCALE_TYPES } from './constants'

export const ChordBrowserChord = styled.div`
	height: 44px;
	width: 180px;
	padding: 8px 12px 8px 16px;
	display: flex;
	align-items: center;
	/* justify-content: center; */
	/* border: 2px solid var(--gray-2); */

	/* background: linear-gradient(45deg, var(--gray-3), var(--gray-3)); */
	box-shadow: inset 0 0 0 1px var(--gray-a7);
	background: var(--white);
	transition: all 0.1s ease-in-out;
	position: relative;
	justify-content: space-between;

	&.isPinned {
		.actionIcon.pinButton {
			opacity: 1;
		}
	}

	& .actionIcon {
		opacity: 0;
		transition: opacity 0.1s ease-in-out;
	}

	&:hover {
		background: linear-gradient(45deg, var(--accent-1), var(--accent-3));
		/* background: var(--accent-2); */
		/* border: 1px solid var(--accent-9); */
		box-shadow: inset 0 0 0 1px var(--accent-9);
		color: var(--accent-12);

		& .actionIcon {
			opacity: 1;
		}
	}
`

export const ChordsView = observer(() => {
	return (
		<Flex.Column className='ChordsView' height='100vh' maxHeight='100%' gap='4'>
			<ChordBrowser />
			<ProgressionPanel />
		</Flex.Column>
	)
})

const SymbolText = styled.p`
	text-transform: uppercase;
	font-weight: 900;
`

const ChordBrowser = observer(() => {
	return (
		<Flex.Column className='ChordBrowser' gap='2' pl='4'>
			<Flex.Row className='browserControls' align='center' gap='2'>
				<Typography.Bold data-uppercase>CHORDS</Typography.Bold>
				<Flex.Row className='filterOptions' gap='2'>
					<SimpleSelect options={ROOT_NOTES} value={$store.rootNote} onChange={(value) => $store.setRootNote(value)} />
					<SimpleSelect options={SCALE_TYPES} value={$store.scaleType} onChange={(value) => $store.setScaleType(value)} />
				</Flex.Row>
				<Flex.Row className='actions' gap='2' align='center'>
					<IconButton onClick={$store.reset} variant='soft'>
						<Icon icon='material-symbols:device-reset' width='18px' height='18px' />
					</IconButton>
					<IconButton onClick={$store.reset} variant='soft'>
						<Icon icon='iconoir:dice-six' width='18px' height='18px' />
					</IconButton>
				</Flex.Row>
			</Flex.Row>
			<ScrollArea
				scrollbars='horizontal'
				className='w-full overflow-x-auto'
				style={{ height: '16.15rem', border: '1px solid var(--gray-9)', padding: '8px' }}
			>
				<Flex.Column wrap='wrap' gap='2' height='15.5rem' width='max-content' pr='4'>
					{$store.scaleChords.map((chord) => (
						<BrowserChord key={chord.symbol} chord={chord} />
					))}
				</Flex.Column>
			</ScrollArea>
		</Flex.Column>
	)
})

type BrowserChordPropsT = {
	chord: ChordT
}

const BrowserChord = observer((props: BrowserChordPropsT) => {
	const isEditing = useDatass.boolean(false)
	const isPinned = $store.checkChordPinned(props.chord.id)
	const pinButtonVariant = isPinned ? 'solid' : 'outline'
	const isEditingClass = isEditing.state ? 'isEditing' : ''
	const isPinnedClass = isPinned ? 'isPinned' : ''
	const classes = classNames('BrowserChord', isEditingClass, isPinnedClass)
	const togglePin = () => $store.togglePinnedChordId(props.chord.id)
	const toggleEdit = () => isEditing.set.toggle()
	// TODO: On click, play the chord.

	return (
		<Popover.Root>
			<Popover.Anchor asChild>
				<ChordBrowserChord className={classes} key={props.chord.symbol} data-accent-color={props.chord.color}>
					<SymbolText className='symbol' data-uppercase>
						{props.chord.symbol}
					</SymbolText>
					<Flex.Row className='actions' gap='2' align='center'>
						<Popover.Trigger>
							<IconButton variant='outline' size='1' className='actionIcon editButton' onClick={toggleEdit}>
								<Icon icon='eos-icons:rotating-gear' width='14px' height='14px' />
							</IconButton>
						</Popover.Trigger>
						<IconButton variant={pinButtonVariant} size='1' className='actionIcon pinButton' onClick={togglePin}>
							<Icon icon='eos-icons:pin' width='14px' height='14px' />
						</IconButton>
					</Flex.Row>
				</ChordBrowserChord>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content className='PopoverContent'>
					<h3>well howdy</h3>
					<Popover.Close />
					<Popover.Arrow />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
})

// const ProgressionPanel = observer(() => {
// 	return (
// 		<Flex.Column className='ProgressionPanel' gap='2'>
// 			<Flex.Row className='topRow'>
// 				<Flex.Row gap='2' className='leftSide'>
// 					<IconButton onClick={$store.addRestToProgression}>
// 						<Icon icon='(todo: add rest icon)' />
// 					</IconButton>
// 					<Typography.H3>Progression</Typography.H3>
// 				</Flex.Row>
// 			</Flex.Row>

// 			<Flex.Row className='progressionSteps' wrap='wrap' gap='2'>
// 				{$store.steps.map((step) => (
// 					<ChordBrowserChord key={step.id} color={step.color}>
// 						<Typography.H4 className='symbol'>{step.symbol}</Typography.H4>
// 					</ChordBrowserChord>
// 				))}
// 			</Flex.Row>
// 		</Flex.Column>
// 	)
// })
