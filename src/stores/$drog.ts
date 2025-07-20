import { just } from '#/modules/just'
import { observable, action, computed } from 'mobx'
import { computedFn } from 'mobx-utils'

type OffsetT = { x: number; y: number }

class DrogStore {
	@observable accessor dragOffset = { x: 0, y: 0 }
	@observable accessor draggingItem: any = null
	@observable accessor draggingProgressionStep: any = null
	@observable accessor mousePosition = { x: 0, y: 0 }
	@observable accessor hasDraggedDistance = false

	@computed get isDragging() {
		if (this.draggingItem || this.draggingProgressionStep) return true
	}

	@computed get isDraggingBrowserChord() {
		if (!this.draggingItem) return false
		const hasDuration = 'durationBeats' in this.draggingItem
		return hasDuration
	}

	@computed get isDraggingProgressionStep() {
		return !!this.draggingProgressionStep
	}

	@action setDraggingItem = (chord) => {
		this.draggingItem = chord
	}

	@action setDraggingProgressionStep = (step) => {
		this.draggingProgressionStep = step
	}

	@action setMousePosition = (position: OffsetT) => {
		this.mousePosition = position
	}

	@action setHasDraggedDistance = (hasDragged: boolean) => {
		this.hasDraggedDistance = hasDragged
	}

	@action clearDrag = () => {
		this.draggingItem = null
		this.draggingProgressionStep = null
		this.hasDraggedDistance = false
	}

	@action setDragOffset = just.throttle(20, (offset: OffsetT) => {
		this.dragOffset = offset
	})

	checkIsDraggingId = computedFn((id: string) => {
		if (!this.draggingItem) return false
		return this.draggingItem.id === id
	})

	checkIsDraggingProgressionStepId = computedFn((id: string) => {
		if (!this.draggingProgressionStep) return false
		return this.draggingProgressionStep.id === id
	})
}

export const $drog = new DrogStore()
