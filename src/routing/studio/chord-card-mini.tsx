import { Flex } from '#/components/Flex'
import { Text } from '#/components/text'
import { $drog } from '#/stores/$drog'
import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'

export const ChordCardMini = observer(() => {
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		if ($drog.draggingItem) {
			setIsAnimating(true)
			const timer = setTimeout(() => setIsAnimating(false), 300)
			return () => clearTimeout(timer)
		}
	}, [$drog.draggingItem])

	if (!$drog.draggingItem) return

	const animationClass = isAnimating ? 'animate-bounce' : ''

	return (
		<Flex.Row
			p='4'
			data-accent-color={$drog.draggingItem.color}
			className={`ChordCard MiniChordCard z-50 transition-all duration-300 ${animationClass}`}
			style={{
				left: $drog.dragOffset.x,
				top: $drog.dragOffset.y,
				transform: 'rotate(5deg) scale(0.9)',
				animation: isAnimating ? 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : undefined,
			}}
		>
			<Text.h3>{$drog.draggingItem.symbol}</Text.h3>
		</Flex.Row>
	)
})
