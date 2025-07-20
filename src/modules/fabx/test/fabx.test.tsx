import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { observer } from 'mobx-react-lite'
import { fabx } from '../fabx' // update path as needed

describe('mobx store factory', () => {
	it('reacts to state changes and supports selectors', async () => {
		// Create store with initial state and actions
		const store = fabx(
			{
				foo: true,
				bar: [1, 2, 3],
				baz: { yolo: 42 },
			},
			{
				toggleFoo: (store) => {
					store.state.foo = !store.state.foo
				},
			}
		)

		// Component using various selectors
		const TestComponent = observer(() => {
			const foo = store.use.foo()
			const yolo = store.use('baz.yolo')
			const barLength = store.use((s) => s.bar.length)
			return (
				<div>
					<span data-testid='foo'>{foo ? 'yes' : 'no'}</span>
					<span data-testid='yolo'>{yolo}</span>
					<span data-testid='bar-length'>{barLength}</span>
					<button onClick={store.toggleFoo}>Toggle Foo</button>
				</div>
			)
		})

		render(<TestComponent />)

		// Initial render
		expect(screen.getByTestId('foo').textContent).toBe('yes')
		expect(screen.getByTestId('yolo').textContent).toBe('42')
		expect(screen.getByTestId('bar-length').textContent).toBe('3')

		// Trigger action
		fireEvent.click(screen.getByText('Toggle Foo'))
		expect(screen.getByTestId('foo').textContent).toBe('no')
	})

	it('supports deep path selector', () => {
		const store = fabx({ nested: { value: 5 } }, {})
		const TestComponent = observer(() => {
			const val = store.use('nested.value')
			return <span data-testid='val'>{val}</span>
		})
		render(<TestComponent />)
		expect(screen.getByTestId('val').textContent).toBe('5')
		// Update state and check reactivity
		store.state.nested.value = 42
		expect(screen.getByTestId('val').textContent).toBe('42')
	})

	it('can register actions in actions object', () => {
		const store = fabx(
			{ count: 0 },
			{
				increment: (store) => {
					store.state.count++
				},
				decrement: (store) => {
					store.state.count--
				},
			}
		)

		const TestComponent = observer(() => {
			const count = store.use('count')
			return (
				<div>
					<span data-testid='count'>{count}</span>
					<button onClick={store.increment}>+</button>
					<button onClick={store.decrement}>-</button>
				</div>
			)
		})

		render(<TestComponent />)
		expect(screen.getByTestId('count').textContent).toBe('0')
		fireEvent.click(screen.getByText('+'))
		expect(screen.getByTestId('count').textContent).toBe('1')
		fireEvent.click(screen.getByText('-'))
		expect(screen.getByTestId('count').textContent).toBe('0')
	})

	it('supports computed values', () => {
		// Create store with computed values
		const store = fabx(
			{
				items: [
					{ id: 1, name: 'apple' },
					{ id: 2, name: 'banana' },
					{ id: 3, name: 'cherry' },
				],
			},
			{
				addItem: (store, item) => {
					store.state.items.push(item)
				},
			},
			{
				ids: (store) => store.state.items.map((item) => item.id),
				count: (store) => store.state.items.length,
				moreThan3: (store) => store.state.items.length > 3,
			}
		)

		// Test initial computed values
		expect(store.ids).toEqual([1, 2, 3])
		expect(store.count).toBe(3)
		expect(store.moreThan3).toBe(false)

		// Test computed values react to state changes
		store.addItem({ id: 4, name: 'date' })
		expect(store.ids).toEqual([1, 2, 3, 4])
		expect(store.count).toBe(4)
		expect(store.moreThan3).toBe(true)
	})

	it('computed values work in observer components', () => {
		const store = fabx(
			{ items: [] },
			{
				addItem: (store, item) => {
					store.state.items.push(item)
				},
			},
			{
				count: (store) => store.state.items.length,
				isEmpty: (store) => store.state.items.length === 0,
			}
		)

		const TestComponent = observer(() => {
			const isEmpty = store.isEmpty
			const count = store.count
			return (
				<div>
					<span data-testid='empty'>{isEmpty ? 'empty' : 'not-empty'}</span>
					<span data-testid='count'>{count}</span>
					<button onClick={() => store.addItem({ id: 1 })}>Add Item</button>
				</div>
			)
		})

		render(<TestComponent />)

		// Initial state
		expect(screen.getByTestId('empty').textContent).toBe('empty')
		expect(screen.getByTestId('count').textContent).toBe('0')

		// After adding item
		fireEvent.click(screen.getByText('Add Item'))
		expect(screen.getByTestId('empty').textContent).toBe('not-empty')
		expect(screen.getByTestId('count').textContent).toBe('1')
	})
})
