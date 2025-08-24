import type { Output } from 'webmidi'
import { WebMidi } from 'webmidi'
import Soundfont from 'soundfont-player'
import type { InstrumentName, Player } from 'soundfont-player'
import { observable, action, computed } from 'mobx'
import { too } from '#/modules/too'
import { createMidiEngine } from '#/modules/midiEngine'

class OutputStore {
	@observable accessor volume = 0.7
	@observable accessor isMuted = false
	@observable accessor isMidiReady = false
	@observable accessor isInstrumentReady = false
	@observable accessor isMidiConnected = false
	@observable accessor isMidiLoading = false
	@observable accessor isInstrumentLoading = false
	@observable accessor isOutputEnabled = false
	@observable accessor target = 'instrument'
	@observable accessor instrumentName = 'acoustic_grand_piano'
	@observable accessor instrument: any = null
	@observable accessor instruments: Record<string, Player> = {}
	@observable accessor instrumentsError: any = null
	@observable accessor audioContext: AudioContext = null!
	@observable accessor midiOutputNames: string[] = []
	@observable accessor midiOutputName = ''
	@observable accessor midiOutput: Output = null!
	@observable accessor midiError: any = null
	@observable accessor instrumentNames = ['acoustic_grand_piano', 'acoustic_guitar_nylon', 'electric_guitar_clean', 'xylophone', 'marimba']

	engine = createMidiEngine()

	@computed get isReady() {
		return this.isInstrumentReady || this.isMidiReady
	}

	@action setVolume = (value: number) => {
		this.volume = value
	}

	@action setTarget = (target: string) => {
		this.target = target
	}

	@action setSelectedInstrument = (name: string, instrument: Player) => {
		this.instrumentName = name
		this.instrument = instrument
	}

	private loadInstrument = async (context: AudioContext, name: InstrumentName) => {
		return new Promise((resolve, reject) => {
			Soundfont.instrument(context, name).then(resolve).catch(reject)
		})
	}

	@action initialize = async () => {
		const context = new AudioContext()
		this.audioContext = context
		this.isInstrumentLoading = true

		const loader0 = this.loadInstrument(context, 'acoustic_grand_piano')
		const loader1 = this.loadInstrument(context, 'acoustic_guitar_nylon')
		const loader2 = this.loadInstrument(context, 'electric_guitar_clean')
		const loader3 = this.loadInstrument(context, 'xylophone')
		const loader4 = this.loadInstrument(context, 'marimba')
		const instrumentPromises = [loader0, loader1, loader2, loader3, loader4]
		const instrumentsResult = await too(Promise.all(instrumentPromises))
		const midiConnectResult = await too(WebMidi.enable())
		this.isInstrumentLoading = false
		this.isMidiLoading = false

		if (instrumentsResult.didFail) {
			console.error('Error loading instruments:', instrumentsResult.error)
			this.isInstrumentReady = false
			this.instrumentsError = instrumentsResult.error
		}

		if (midiConnectResult.didFail) {
			console.error('Error enabling MIDI:', midiConnectResult.error)
			this.isMidiConnected = false
			this.midiError = midiConnectResult.error
		}

		if (instrumentsResult.didFail && midiConnectResult.didFail) {
			return console.error('Both instrument loading and MIDI enabling failed.')
		}

		if (!instrumentsResult.didFail) {
			console.log('Instruments loaded successfully:', instrumentsResult.data)

			const instruments = instrumentsResult.data as Player[]
			this.isInstrumentReady = true
			this.isInstrumentLoading = false

			console.log('Setting up instruments:', instruments)
			this.instruments = {
				acoustic_grand_piano: instruments[0],
				acoustic_guitar_nylon: instruments[1],
				electric_guitar_clean: instruments[2],
				xylophone: instruments[3],
				marimba: instruments[4],
			}

			console.log('Selecting default instrument:', this.instrumentName)
			this.setSelectedInstrument(this.instrumentName, this.instruments[this.instrumentName])
		}

		if (!midiConnectResult.didFail) {
			const outputs = WebMidi.outputs
			const outputNames = outputs.map((output) => output.name)
			console.log('MIDI enabled successfully:', { outputs, outputNames })
			this.isMidiReady = true
			this.isMidiConnected = true

			const getName = (output: Output) => output.name
			const names = WebMidi.outputs.map(getName)
			const midiOutput = WebMidi.getOutputByName(names[0]) as Output
			this.isMidiConnected = true
			this.midiOutputNames = names
			this.midiOutputName = names[0]
			this.midiOutput = midiOutput
			this.isMidiReady = true
			console.warn('[midi ready]', { names, midiOutput })
		}
	}
}

export const $output = new OutputStore()
