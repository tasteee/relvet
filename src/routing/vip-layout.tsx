import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Flex } from '#/components/Flex'
import { IconButton } from '@radix-ui/themes'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Typography } from '#/styles/system'
import { ChordsView } from './chords'
import { PatternsView } from './patterns'
import { styled } from 'styled-components'

const ViewSwitcher = styled.div`
	position: fixed;
	top: 16px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1000;
	background: var(--gray-1);
	border: 1px solid var(--gray-6);
	border-radius: 8px;
	padding: 4px;
	box-shadow: 0 4px 12px var(--black-a4);
`

const ViewButton = styled.button<{ isActive: boolean }>`
	background: ${props => props.isActive ? 'var(--accent-9)' : 'transparent'};
	color: ${props => props.isActive ? 'var(--accent-1)' : 'var(--gray-12)'};
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.15s ease;

	&:hover {
		background: ${props => props.isActive ? 'var(--accent-10)' : 'var(--gray-3)'};
	}
`

type ViewT = 'chords' | 'patterns'

type VipLayoutPropsT = {
	initialView?: ViewT
}

export const VipLayout = observer((props: VipLayoutPropsT) => {
	const [currentView, setCurrentView] = useState<ViewT>(props.initialView || 'chords')

	const handleViewChange = (view: ViewT) => {
		setCurrentView(view)
	}

	return (
		<>
			<ViewSwitcher>
				<Flex.Row gap='1' align='center'>
					<ViewButton 
						isActive={currentView === 'chords'} 
						onClick={() => handleViewChange('chords')}
					>
						CHORDS
					</ViewButton>
					<ViewButton 
						isActive={currentView === 'patterns'} 
						onClick={() => handleViewChange('patterns')}
					>
						PATTERNS
					</ViewButton>
				</Flex.Row>
			</ViewSwitcher>

			{currentView === 'chords' && <ChordsView />}
			{currentView === 'patterns' && <PatternsView />}
		</>
	)
})