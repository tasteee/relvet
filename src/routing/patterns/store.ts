import { observable, action, computed } from 'mobx'
import { computedFn } from 'mobx-utils'

type PatternNoteT = {
	id: string
	toneId: string
	beatIndex: number
	velocity: number
}

class PatternsStore {
	@observable accessor selectedPatternId: string | null = null
	@observable accessor patternNotes: PatternNoteT[] = []

	@computed get notesByToneAndBeat() {
		const noteMap = new Map<string, PatternNoteT>()
		this.patternNotes.forEach(note => {
			const key = `${note.toneId}-${note.beatIndex}`
			noteMap.set(key, note)
		})
		return noteMap
	}

	hasNoteAt = computedFn((toneId: string, beatIndex: number) => {
		const key = `${toneId}-${beatIndex}`
		return this.notesByToneAndBeat.has(key)
	})

	@action toggleNote = (toneId: string, beatIndex: number) => {
		const existingNoteIndex = this.patternNotes.findIndex(
			note => note.toneId === toneId && note.beatIndex === beatIndex
		)

		if (existingNoteIndex !== -1) {
			// Remove existing note
			this.patternNotes.splice(existingNoteIndex, 1)
		} else {
			// Add new note
			const newNote: PatternNoteT = {
				id: crypto.randomUUID(),
				toneId,
				beatIndex,
				velocity: 80 // Default velocity
			}
			this.patternNotes.push(newNote)
		}
	}

	@action clearPattern = () => {
		this.patternNotes = []
	}

	@action setVelocity = (noteId: string, velocity: number) => {
		const note = this.patternNotes.find(n => n.id === noteId)
		if (note) {
			note.velocity = velocity
		}
	}
}

export const $patterns = new PatternsStore()