export const cssVarVal = (name: string): string => {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
