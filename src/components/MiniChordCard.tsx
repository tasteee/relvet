import { observer } from 'mobx-react-lite'
import { $drog } from '#/stores/$drog'
import { Flex } from './Flex'
import { Text } from './text'
import { createPortal } from 'react-dom'
import './MiniChordCard.css'

type PropsT = Record<string, never>

export const MiniChordCard = observer(() => {
	const item = $drog.draggingItem
	const mousePosition = $drog.mousePosition
	if (!item) return

	const portalContent = (
		<div
			style={{
				position: 'fixed',
				left: mousePosition.x + 10,
				top: mousePosition.y - 20,
				zIndex: 9999,
				pointerEvents: 'none',
				transform: 'rotate(5deg)',
			}}
		>
			<Flex.Row
				align='center'
				py='2'
				px='3'
				gap='2'
				className='MiniChordCard'
				data-accent-color={item.color}
				style={{
					backgroundColor: 'var(--color-panel-solid)',
					border: '1px solid var(--color-border)',
					borderRadius: '6px',
					boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
					minWidth: '60px',
				}}
			>
				<Text.p className='symbol' style={{ fontSize: '14px', fontWeight: '500' }}>
					{item.symbol}
				</Text.p>
			</Flex.Row>
		</div>
	)

	return createPortal(portalContent, document.body)
})
