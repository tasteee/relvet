import { layout, text } from '#/components'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#components/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { VolumeController } from '#/components/VoluimeController'
import { $auth } from '#/stores/$auth'
import { Icon } from '@iconify/react'
import { observer } from 'mobx-react-lite'
import { useLocation } from 'wouter'

type PropsT = {
	isDark?: boolean
}

export const NavBar = observer((props: PropsT) => {
	const [, setLocation] = useLocation()
	const logoUrl = props.isDark ? '/logo.svg' : '/logo-dark.svg'
	const navClasses = props.isDark ? '' : ''

	return (
		<nav className={`flex items-center justify-between p-4 ${navClasses}`}>
			<div className='flex items-center gap-4'>
				<img src={logoUrl} alt='Logo' className='w-[100px]' />
				<VolumeController variant='ghost' size='2' />
				{/* <span className='text-lg font-bold'>Velvet</span> */}
			</div>
			<div className='flex gap-4 items-center'>
				{$auth.isAuthenticated && (
					<Button onClick={() => setLocation('/studio')} className=''>
						STUDIO
					</Button>
				)}
				<a href='/home' className={`hover:underline ${props.isDark ? 'text-foreground' : ''}`}>
					Home
				</a>
				<a href='/browse' className={`hover:underline ${props.isDark ? 'text-foreground' : ''}`}>
					Browse
				</a>
				<a href='/library' className={`hover:underline ${props.isDark ? 'text-foreground' : ''}`}>
					Library
				</a>
			</div>
			<div className='flex items-center space-x-2'>
				<Icon
					icon='mdi:settings'
					className={`cursor-pointer ${props.isDark ? 'text-foreground hover:text-muted-foreground' : 'text-gray-600 hover:text-gray-800'}`}
					width={24}
					height={24}
				/>
				{$auth.isAuthenticated ? (
					<Avatar className='rounded-md'>
						<AvatarImage src='./avatar-80-07.jpg' alt='Kelly King' />
						<AvatarFallback>KK</AvatarFallback>
					</Avatar>
				) : (
					<Button onClick={() => $auth.authenticate('', '')}>Login</Button>
				)}
			</div>
		</nav>
	)
})
