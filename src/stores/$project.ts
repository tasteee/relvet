import { observable, action } from 'mobx'

class ProjectStore {
	@observable accessor id: string = crypto.randomUUID()
	@observable accessor name: string = ''
	@observable accessor bpm: number = 93
	@observable accessor scaleRootNote: string = 'F#'
	@observable accessor scaleType: string = 'Minor'
	@observable accessor baseOctave: number = 3
	@observable accessor description: string = ''
	@observable accessor tags: string[] = []

	@action setBaseOctave = (octave: number) => {
		this.baseOctave = octave
	}

	@action addTag = (tag: string) => {
		const alreadyExists = this.tags.includes(tag)
		if (alreadyExists) return
		this.tags.push(tag)
	}

	@action removeTag = (tag: string) => {
		const index = this.tags.indexOf(tag)
		if (index === -1) return
		this.tags.splice(index, 1)
	}

	@action setName = (name: string) => {
		this.name = name
	}

	@action setBpm = (bpm: number) => {
		this.bpm = bpm
	}

	@action setScaleRootNote = (note: string) => {
		this.scaleRootNote = note
	}

	@action setScaleType = (type: string) => {
		this.scaleType = type
	}

	@action setDescription = (description: string) => {
		this.description = description
	}
}

export const $project = new ProjectStore()
