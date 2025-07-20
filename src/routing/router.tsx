import { Switch, Route, useLocation } from 'wouter'
import { Home } from './site/home'
import { text, layout, FontSelect } from '#/components'
import { StudioHome } from './studio/home'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { $main } from '#/stores/$main'
import { ChordsView } from './chords'
import { PatternsView } from './patterns'
import { VipLayout } from './vip-layout'

export const Router = observer(() => {
	return (
		<>
			<MainStoreRoutingBranch />
			<Switch>
				<Route path='/' component={VipLayout} />
				<Route path='/chords' component={() => <VipLayout initialView="chords" />} />
				<Route path='/patterns' component={() => <VipLayout initialView="patterns" />} />
				{/* <Route path='studio' component={StudioHome} /> */}
				<Route path='*' component={VipLayout} />
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
