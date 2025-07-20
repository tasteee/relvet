import { action, observable } from 'mobx'

class MainStore {
	@observable accessor isDarkMode = true

	@action setDarkMode = (value: boolean) => {
		this.isDarkMode = value
	}
}

export const $main = new MainStore()
