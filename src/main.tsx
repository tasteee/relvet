// import './styles/reset.css'
import '#/modules/theory'
import '@radix-ui/themes/styles.css'
import './styles/accents.css'
import './styles/overrides.css'
import './styles/index.css'
import './styles/system/accents.css'

import { configure } from 'mobx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

configure({
	enforceActions: 'never',
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
