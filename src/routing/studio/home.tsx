import { Box } from '#/components/layout'
import { ScaleRootNoteSelect } from '#/routing/chords/scaleRootNoteSelect'
import { ScaleTypeSelect } from '#/routing/chords/scaleTypeSelect'
import { observer } from 'mobx-react-lite'
import { NavBar } from '../site/navbar'
import { theory } from '#/modules/theory'
import { $project } from '#/stores/$project'
import { ChordCard } from './chord-card'
import { ProgressionBar } from './progression-bar'
import { PianoDisplay } from '#/components/PianoDisplay'
import { ScrollArea } from '@radix-ui/themes'
import { Flex } from '#/components/Flex'
import './home.css'

export const StudioHome = () => {
	return (
		<>
			<Box.column className='StudioHome dark text-foreground min-h-screen h-full dot-grid-background'>
				<Flex.Column className='header'>
					<NavBar isDark />
				</Flex.Column>
				<Box.row className='main' width='full' height='full'>
					<MainContent />
				</Box.row>
				<ProgressionBar />
			</Box.column>
			<PianoDisplay />
		</>
	)
}

const MainContent = observer(() => {
	const scale = `${$project.scaleRootNote} ${$project.scaleType}`
	const list = theory.getVastScaleChords(scale)
	const chordsList = list.map((chord) => chord.symbol)

	return (
		<ScrollArea className='chordList w-full px-6 pb-6 mx-auto' style={{ height: 'calc(100vh - 292px)' }} scrollbars='vertical'>
			<TopBar />
			<div className='py-4 pb-[100px] flex-wrap flex gap-2'>
				{chordsList.map((chord, index) => (
					<ChordCard key={chord} symbol={chord} />
				))}
			</div>
		</ScrollArea>
	)
})

const TopBar = () => {
	return (
		<Flex.Row width='full' justify='center' align='center' pb='8px' className='topBar'>
			<Flex.Row className='innerTopBar' gap='4'>
				<ScaleRootNoteSelect />
				<ScaleTypeSelect />
			</Flex.Row>
		</Flex.Row>
	)
}
