import { theory } from '#/modules/theory'
import { action, computed, observable, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

class ChordsStore {
	@observable accessor selectedStepId = ''
	@observable accessor rootNote = 'F#'
	@observable accessor scaleType = 'Minor'
	@observable accessor isLoading = false
	@observable accessor steps = []
	@observable accessor pinnedChordIds = []

	@computed get scaleName() {
		return `${this.rootNote} ${this.scaleType}`
	}

	@computed get totalBeats(): number {
		return this.steps.reduce((sum, step) => sum + step.durationBeats, 0)
	}

	@computed get totalBars(): number {
		return this.totalBeats / 4 // assuming 4/4
	}

	@computed get scale() {
		const scale = theory.getScale(this.scaleName)
		const color = theory.getTonicColor(scale.tonic)
		return { color, ...scale }
	}

	@computed get scaleChords() {
		return theory.getVastScaleChords(this.scaleName)
	}

	checkChordPinned = computedFn((id) => {
		return this.pinnedChordIds.includes(id)
	})

	// @action toggleEditingChordId = (id) => {
	// 	const isEditing = (this.editingChordId = id)
	// 	if (isEditing) return (this.editingChordId = '')
	// 	this.editingChordId = id
	// }

	@action togglePinnedChordId = (id) => {
		const isPinned = this.pinnedChordIds.includes(id)
		if (!isPinned) return this.pinnedChordIds.push(id)
		const index = this.pinnedChordIds.indexOf(id)
		this.pinnedChordIds.splice(index, 1)
	}

	@action reset = () => {
		this.selectedStepId = ''
		this.rootNote = 'F#'
		this.scaleType = 'Minor'
		this.steps = []
	}

	@action setRootNote = (note) => (this.rootNote = note)
	@action setScaleType = (type) => (this.scaleType = type)
	@action setProgression = (progression) => (this.steps = progression)
	@action clearProgression = () => (this.steps = [])
	@action selectStep = (id) => (this.selectedStepId = id)
	@action deselectStep = () => (this.selectedStepId = '')

	@action addChordToProgression = (chord) => {
		const newId = crypto.randomUUID()
		const jsChord = toJS(chord)
		jsChord.durationBeats = 4
		jsChord.isRest = false
		jsChord.id = newId
		this.steps.push(jsChord)
	}

	@action addRestToProgression = () => {
		const id = crypto.randomUUID()
		const restChord = { id, isRest: true } as any
		restChord.symbol = 'Rest'
		restChord.tonic = ''
		restChord.notes = []
		restChord.bassNote = ''
		restChord.voicing = 'closed'
		restChord.inversion = 0
		restChord.octave = 0
		restChord.color = 'gray'
		restChord.durationBeats = 4
		this.steps.push(restChord)
	}

	@action duplicateStep = (id = this.selectedStepId) => {
		const index = this.steps.findIndex((chord) => chord.id === id)
		if (index === -1) return // step not found
		const chord = toJS(this.steps[index])
		const newId = crypto.randomUUID()
		// note: no need to manually set a start time or anything
		// because since chords exist consecutively, the first
		// chord will always start at 0, the next will start
		// at the end time (the duration) of the first, etc.
		chord.id = newId
		this.steps.splice(index + 1, 0, chord)
	}

	@action removeChordFromProgression = (id) => {
		const index = this.steps.findIndex((chord) => chord.id === id)
		this.steps.splice(index, 1)
	}

	@action moveStepLeft = (id = this.selectedStepId) => {
		const index = this.steps.findIndex((chord) => chord.id === id)
		if (index === 0) return // its all the way left
		const [chord] = this.steps.splice(index, 1)
		this.steps.splice(index - 1, 0, chord)
	}

	@action moveStepRight = (id = this.selectedStepId) => {
		const index = this.steps.findIndex((chord) => chord.id === id)
		if (index === this.steps.length - 1) return // its all the way right
		const [chord] = this.steps.splice(index, 1)
		this.steps.splice(index + 1, 0, chord)
	}
}

export const $store = new ChordsStore()
