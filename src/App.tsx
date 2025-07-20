import { FontSelect } from '#/components/FontSelect'
import { text, layout } from '#/components'
import { Router } from './routing/router'
import { Theme } from '@radix-ui/themes'
import { observer } from 'mobx-react-lite'
import { $main } from './stores/$main'

const App = observer(() => {
	return (
		<Theme appearance='light' accentColor='jade' grayColor='slate' panelBackground='solid' scaling='100%' radius='none'>
			<Router />
		</Theme>
	)
})

export default App
