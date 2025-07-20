import { cn } from '../../lib/cn'
import React from 'react'

type PropsT = {
	children?: React.ReactNode
	className?: string
}

export const DotBackgroundDemo = (props: PropsT) => {
	return (
		<div className={cn('dot-grid-background', props.className)}>
			<div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black'></div>
			{props.children || (
				<p className='relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl'>
					Backgrounds
				</p>
			)}
		</div>
	)
}
