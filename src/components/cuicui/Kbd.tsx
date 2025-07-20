export function Kbd() {
	return (
		<kbd className='transform-gpu cursor-pointer rounded-[16px] border border-neutral-500/50 bg-neutral-300 shadow-[-10px_0px_15px_rgba(255,255,255,1),3px_10px_12.5px_rgba(0,0,0,0.1)] outline-hidden transition-all duration-150 active:shadow-none dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[-10px_0px_15px_rgba(0,0,0,0.3),3px_10px_12.5px_rgba(255,255,255,0.05)]'>
			<span className='-translate-y-1 z-10 block size-full transform-gpu rounded-[15px] bg-neutral-100 px-3 py-1 text-neutral-500 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.8)] transition-all duration-150 active:translate-y-0 active:shadow-transparent dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-[inset_0px_2px_4px_rgba(255,255,255,0.05)]'>
				<span className='block text-end'>⌘</span>
				<span className='text-nowrap font-medium text-xs'>command</span>
			</span>
		</kbd>
	)
}

import { cn } from 'cn'

export default function ModernDetailedKbdVariant1() {
	return (
		<kbd
			className={cn(
				'grid transform-gpu select-none place-content-center text-nowrap rounded-lg px-4 py-2 font-medium text-xs tracking-tighter transition-all duration-100',
				'bg-linear-to-b from-neutral-200 to-neutral-200/50 text-neutral-800 dark:from-neutral-950 dark:to-neutral-950/65 dark:text-neutral-300',
				'shadow-[0_1.5px_0.5px_1.5px_rgba(0,0,0,0.1),_0_0_0.5px_1px_rgba(0,0,0,0.25),_inset_0_1px_0.5px_0.5px_rgba(255,255,255,0.4),_inset_0_1px_1px_1px_rgba(255,255,255,0.8)]',
				'dark:shadow-[0_1.5px_0.5px_2.5px_rgba(0,0,0,0.4),_0_0_0.5px_1px_rgba(0,0,0,1),_inset_0_2px_1px_1px_rgba(0,0,0,0.25),_inset_0_1px_1px_1px_rgba(255,255,255,0.2)]',
				'dark:hover:shadow-[0_0_0_0_rgba(0,0,0,0),_0_0_0.5px_1px_rgba(0,0,0,1),_inset_0_2px_1px_1px_rgba(0,0,0,0.25),_inset_0_1px_1px_0_rgba(255,255,255,0.15)]',
				'hover:shadow-[0_0_0_0_rgba(0,0,0,0),_0_0_0.5px_1px_rgba(0,0,0,0.25),_inset_0_1px_0.5px_0.5px_rgba(255,255,255,0.4),_inset_0_1px_1px_1px_rgba(255,255,255,0.8)]',
				'active:shadow-[0_0_0_0_rgba(0,0,0,0),_0_0_1px_1px_rgba(0,0,0,0.15),_inset_0_1px_0.5px_0.5px_rgba(0,0,0,0.3),_inset_0_1.5px_1.5px_1.5px_rgba(255,255,255,0.6)]',
				'dark:active:shadow-[0_0_0_0_rgba(0,0,0,0),_0_0_1px_1px_rgba(0,0,0,1),_inset_0_2px_2px_1px_rgba(0,0,0,1),_inset_0_2px_2px_0_rgba(255,255,255,0.1)]'
			)}
		>
			⌘ + Option + Shift + K
		</kbd>
	)
}
