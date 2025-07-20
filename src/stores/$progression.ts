import { createProgression, createStep } from '#/modules/creators'
import { observable, action, computed, autorun, toJS } from 'mobx'
import { $output } from './$output'
import { computedFn } from 'mobx-utils'

// The user can add a chord or rest to the progression.
// The user can remove a chord or rest from the progression.
// The user can move a chord or rest within the progression.
// The user can edit the properties of a chord or rest in the progression.
// The user can change the length of the progression in beats.
// The user can change the bpm of the progression.
// The user can change the order of the steps in the progression.

const initialState = createProgression()

class ProgressionStore {
	@observable accessor id: string = initialState.id
	@observable accessor lengthBars: number = initialState.lengthBars
	@observable accessor bpm: number = initialState.bpm
	@observable accessor steps: ProgressionStepT[] = initialState.steps
	@observable accessor selectedStepId: string | null = null

	@computed get stepIds() {
		return this.steps.map((item) => item.id)
	}

	@action selectStep = (id: string) => {
		this.selectedStepId = id || null
	}

	@action setlengthBars = (lengthBars: number) => {
		this.lengthBars = lengthBars
	}

	@action setBpm = (bpm: number) => {
		this.bpm = bpm
	}

	@action addStep = (step: Partial<ProgressionStepT>) => {
		const newStep = createStep(step)
		this.steps.push(newStep)
	}

	@action updateStep = (updates: PartialStepWithIdT) => {
		for (const step of this.steps) {
			if (step.id !== updates.id) continue
			Object.assign(step, updates)
			break
		}
	}

	@action moveStep = (id: string, newIndex: number) => {
		const stepIndex = this.steps.findIndex((step) => step.id === id)
		if (stepIndex === -1 || newIndex < 0 || newIndex >= this.steps.length) return

		const [step] = this.steps.splice(stepIndex, 1)
		this.steps.splice(newIndex, 0, step)
	}

	@action deleteSelectedStep = () => {
		const index = this.steps.findIndex((step) => step.id === this.selectedStepId)
		this.steps.splice(index, 1)
	}

	@action duplicateSelectedStep = () => {
		const selectedStep = this.steps.find((step) => step.id === this.selectedStepId)
		const id = crypto.randomUUID()
		const base = toJS(selectedStep)
		const newStep = createStep({ ...base, id })
		const index = this.steps.indexOf(selectedStep)
		this.steps.splice(index + 1, 0, newStep)
	}

	@action moveSelectedStepRight = () => {
		const step = this.steps.find((step) => step.id === this.selectedStepId)
		const index = this.steps.indexOf(step)
		const nextIndex = index + 1
		const nextStep = this.steps[nextIndex]
		if (!nextStep) return
		this.steps[index] = nextStep
		this.steps[nextIndex] = step
	}

	@action moveSelectedStepLeft = () => {
		const step = this.steps.find((step) => step.id === this.selectedStepId)
		const index = this.steps.indexOf(step)
		const nextIndex = index - 1
		const nextStep = this.steps[nextIndex]
		if (!nextStep) return
		this.steps[index] = nextStep
		this.steps[nextIndex] = step
	}

	checkIsSelectedId = computedFn((id: string) => {
		if (!this.selectedStepId) return false
		return this.selectedStepId === id
	})
}

export const $progression = new ProgressionStore()

autorun(() => {
	$output.engine.setProgression({
		id: $progression.id,
		lengthBars: $progression.lengthBars,
		bpm: $progression.bpm,
		steps: $progression.steps,
	})
})
