import { observable, toJS, runInAction, autorun, computed } from 'mobx'
import get from 'just-safe-get'
import { observer } from 'mobx-react-lite'
export { autorun, observer, computed }

type SelectorT<T> = keyof T | string | ((state: T) => any)

type UseSelectorsT<T> = {
	[K in keyof T]: () => T[K]
}

type ComputedValuesT<TStore> = Record<string, () => any>

type AnyFuncT = (...args: any[]) => any

type StoreConfigT<StateT extends object, ActionsT extends Record<string, AnyFuncT>, ComputedT extends ComputedValuesT<any> = {}> = {
	state: StateT
	actions: ActionsT
	computers?: ComputedT
}

type StoreT<StateT, ActionsT, ComputersT = {}> = {
	state: StateT
	use: {
		(selector?: SelectorT<StateT>): any
	} & UseSelectorsT<StateT>
} & ActionsT &
	ComputersT

export function fabx<TState extends object, TActions extends Record<string, AnyFuncT>, TComputed extends ComputedValuesT<any> = {}>(
	config: StoreConfigT<TState, TActions, TComputed>
): StoreT<
	TState,
	{ [K in keyof TActions]: (...args: Parameters<TActions[K]>) => ReturnType<TActions[K]> },
	{ [K in keyof TComputed]: ReturnType<TComputed[K]> }
> {
	const state = observable(config.state)

	// The universal use function
	const use = ((selector?: SelectorT<TState>) => {
		if (!selector) return toJS(state)
		if (typeof selector === 'function') return selector(state)
		if (typeof selector === 'string') return get(state, selector)
		return state[selector as keyof TState]
	}) as StoreT<TState, any>['use']

	// Attach direct selectors: use.foo()
	for (const key of Object.keys(config.state) as Array<keyof TState>) {
		;(use as any)[key] = () => state[key]
	}

	// Build the store object first
	const store: any = { state, use }

	// Attach actions, keeping original signatures
	for (const [name, fn] of Object.entries(config.actions)) {
		store[name] = (...args: any[]) => runInAction(() => fn(...args))
	}

	// Attach computed values
	if (config.computers) {
		for (const [name, computedFn] of Object.entries(config.computers)) {
			Object.defineProperty(store, name, {
				get: computed(() => computedFn()).get,
				enumerable: true,
				configurable: true,
			})
		}
	}

	return store
}
