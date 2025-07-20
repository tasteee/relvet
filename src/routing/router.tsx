import { Switch, Route, useLocation } from 'wouter'
import { Home } from './site/home'
import { text, layout, FontSelect } from '#/components'
import { StudioHome } from './studio/home'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { $main } from '#/stores/$main'
import { ChordsView } from './chords'

export const Router = observer(() => {
	return (
		<>
			<MainStoreRoutingBranch />
			<Switch>
				<Route path='/' component={ChordsView} />
				{/* <Route path='studio' component={StudioHome} /> */}
				<Route path='*' component={ChordsView} />
				{/* <Route path="/settings" component={Settings} /> */}
				{/* <Route path="/auth" component={Auth} /> */}
				{/* Add more routes as needed */}
			</Switch>
		</>
	)
})

const MainStoreRoutingBranch = () => {
	const [location] = useLocation()

	useEffect(() => {
		const isDarkRoute = location.startsWith('/studio')
		$main.setDarkMode(isDarkRoute)
	}, [location])

	return null
}
