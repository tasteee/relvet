// sMIDI Parser and Converter Library
// This library converts between sMIDI format and standard MIDI

interface SMidiMetadata {
	bpm: number
	ppq: number
	signature: [number, number]
}

interface SMidiNote {
	note: string
	time: number
	duration: number
	velocity: number
}

interface SMidiTrack {
	id: string | number
	name: string
	channel: number
	notes: SMidiNote[]
}

interface SMidiData {
	metadata: SMidiMetadata
	tracks: SMidiTrack[]
}

interface MidiEvent {
	type: string
	channel?: number
	note?: number
	velocity?: number
	time: number
	duration?: number
}

interface MidiTrack {
	name?: string
	channel: number
	events: MidiEvent[]
}

interface MidiJSON {
	format: number
	tracks: MidiTrack[]
	ticksPerQuarter: number
	bpm: number
	timeSignature: [number, number]
}

class SMidiConverter {
	private data: SMidiData

	constructor(input: string | MidiJSON | ArrayBuffer) {
		if (typeof input === 'string') {
			this.data = this.parseSmidi(input)
		} else if (input instanceof ArrayBuffer) {
			// Parse MIDI binary data
			this.data = this.parseMidiBuffer(input)
		} else {
			// Parse MIDI JSON
			this.data = this.parseMidiJson(input)
		}
	}

	private parseSmidi(smidiContent: string): SMidiData {
		const lines = smidiContent.trim().split('\n')
		const data: SMidiData = {
			metadata: { bpm: 120, ppq: 96, signature: [4, 4] },
			tracks: [],
		}

		let currentSection = ''
		let currentTrack: SMidiTrack | null = null

		for (const line of lines) {
			const trimmed = line.trim()
			if (!trimmed) continue

			if (trimmed.startsWith('$')) {
				currentSection = trimmed
				if (trimmed === '$TRACK') {
					currentTrack = {
						id: 'undefined',
						name: '',
						channel: 0,
						notes: [],
					}
				}
				continue
			}

			if (currentSection === '$SMIDI') {
				if (trimmed.startsWith('bpm=')) {
					data.metadata.bpm = parseInt(trimmed.split('=')[1])
				} else if (trimmed.startsWith('ppq=')) {
					data.metadata.ppq = parseInt(trimmed.split('=')[1])
				} else if (trimmed.startsWith('signature=')) {
					const sig = trimmed.split('=')[1].split(',').map(Number)
					data.metadata.signature = [sig[0], sig[1]]
				}
			} else if (currentSection === '$TRACK' && currentTrack) {
				if (trimmed.startsWith('id=')) {
					const id = trimmed.split('=')[1]
					currentTrack.id = id === 'undefined' ? 'undefined' : parseInt(id) || id
				} else if (trimmed.startsWith('name=')) {
					currentTrack.name = trimmed.split('=')[1] || ''
				} else if (trimmed.startsWith('channel=')) {
					currentTrack.channel = parseInt(trimmed.split('=')[1])
				} else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
					const noteData = trimmed.slice(1, -1)
					const note = this.parseNote(noteData)
					if (note) {
						currentTrack.notes.push(note)
					}
				}
			}

			// If we encounter a new section or end of input, save current track
			if (trimmed.startsWith('$TRACK') && currentTrack && currentTrack !== data.tracks[data.tracks.length - 1]) {
				data.tracks.push(currentTrack)
			}
		}

		// Add the last track if it exists
		if (currentTrack && !data.tracks.includes(currentTrack)) {
			data.tracks.push(currentTrack)
		}

		return data
	}

	private parseNote(noteData: string): SMidiNote | null {
		const parts = noteData.split(' ')
		const note: Partial<SMidiNote> = {}

		for (const part of parts) {
			const [key, value] = part.split('=')
			switch (key) {
				case 'N':
					note.note = value
					break
				case 'T':
					note.time = parseInt(value)
					break
				case 'D':
					note.duration = parseFloat(value)
					break
				case 'V':
					note.velocity = parseInt(value)
					break
			}
		}

		if (note.note && note.time !== undefined && note.duration !== undefined && note.velocity !== undefined) {
			return note as SMidiNote
		}
		return null
	}

	private parseMidiBuffer(buffer: ArrayBuffer): SMidiData {
		// Basic MIDI parsing - this is a simplified version
		// In production, you'd want to use a proper MIDI parser library
		const data: SMidiData = {
			metadata: { bpm: 120, ppq: 96, signature: [4, 4] },
			tracks: [],
		}

		// This is a placeholder - implement proper MIDI binary parsing
		console.warn('MIDI buffer parsing not fully implemented')
		return data
	}

	private parseMidiJson(midiJson: MidiJSON): SMidiData {
		const data: SMidiData = {
			metadata: {
				bpm: midiJson.bpm || 120,
				ppq: midiJson.ticksPerQuarter || 96,
				signature: midiJson.timeSignature || [4, 4],
			},
			tracks: [],
		}

		midiJson.tracks.forEach((track, index) => {
			const smidiTrack: SMidiTrack = {
				id: index + 1,
				name: track.name || `Track ${index + 1}`,
				channel: track.channel || 0,
				notes: [],
			}

			track.events.forEach((event) => {
				if (event.type === 'note' && event.note !== undefined && event.velocity !== undefined) {
					const note: SMidiNote = {
						note: this.midiNoteToName(event.note),
						time: event.time,
						duration: event.duration || 0,
						velocity: Math.round((event.velocity / 127) * 1000),
					}
					smidiTrack.notes.push(note)
				}
			})

			data.tracks.push(smidiTrack)
		})

		return data
	}

	private midiNoteToName(midiNote: number): string {
		const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
		const octave = Math.floor(midiNote / 12) - 1
		const note = noteNames[midiNote % 12]
		return `${note}${octave}`
	}

	private noteNameToMidi(noteName: string): number {
		const noteMap: { [key: string]: number } = {
			C: 0,
			'C#': 1,
			D: 2,
			'D#': 3,
			E: 4,
			F: 5,
			'F#': 6,
			G: 7,
			'G#': 8,
			A: 9,
			'A#': 10,
			B: 11,
		}

		const match = noteName.match(/^([A-G]#?)(\d+)$/)
		if (!match) return 60 // Default to C4

		const note = match[1]
		const octave = parseInt(match[2])

		return (octave + 1) * 12 + noteMap[note]
	}

	public toJSON(): MidiJSON {
		const tracks: MidiTrack[] = this.data.tracks.map((track) => ({
			name: track.name,
			channel: track.channel,
			events: track.notes.map((note) => ({
				type: 'note',
				channel: track.channel,
				note: this.noteNameToMidi(note.note),
				velocity: Math.round((note.velocity / 1000) * 127),
				time: note.time,
				duration: note.duration,
			})),
		}))

		return {
			format: 1,
			tracks,
			ticksPerQuarter: this.data.metadata.ppq,
			bpm: this.data.metadata.bpm,
			timeSignature: this.data.metadata.signature,
		}
	}

	public toBase64(): string {
		// Convert to MIDI binary format and encode as base64
		const midiData = this.toMidiBinary()
		return this.arrayBufferToBase64(midiData)
	}

	public toDataUri(): string {
		const base64 = this.toBase64()
		return `data:audio/midi;base64,${base64}`
	}

	public toMidi(filepath?: string): ArrayBuffer {
		const midiData = this.toMidiBinary()

		if (filepath && typeof window === 'undefined') {
			// Node.js environment
			const fs = require('fs')
			fs.writeFileSync(filepath, Buffer.from(midiData))
		}

		return midiData
	}

	public toSmidi(): string {
		let result = '$SMIDI\n'
		result += `bpm=${this.data.metadata.bpm}\n`
		result += `ppq=${this.data.metadata.ppq}\n`
		result += `signature=${this.data.metadata.signature[0]},${this.data.metadata.signature[1]}\n`

		for (const track of this.data.tracks) {
			result += '$TRACK\n'
			result += `id=${track.id}\n`
			result += `name=${track.name}\n`
			result += `channel=${track.channel}\n`

			for (const note of track.notes) {
				result += `[N=${note.note} T=${note.time} D=${note.duration} V=${note.velocity}]\n`
			}
		}

		return result
	}

	private toMidiBinary(): ArrayBuffer {
		// This is a simplified MIDI binary creator
		// In production, you'd want to use a proper MIDI library like midi-writer-js

		const midiJson = this.toJSON()

		// Header chunk
		const header = new ArrayBuffer(14)
		const headerView = new DataView(header)

		// "MThd" header
		headerView.setUint32(0, 0x4d546864) // "MThd"
		headerView.setUint32(4, 6) // Header length
		headerView.setUint16(8, midiJson.format) // Format type
		headerView.setUint16(10, midiJson.tracks.length) // Number of tracks
		headerView.setUint16(12, midiJson.ticksPerQuarter) // Ticks per quarter note

		// Track chunks (simplified - you'd need proper MIDI event encoding)
		const trackChunks: ArrayBuffer[] = []

		for (const track of midiJson.tracks) {
			const trackData = this.createTrackChunk(track)
			trackChunks.push(trackData)
		}

		// Combine all chunks
		const totalLength = header.byteLength + trackChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
		const result = new ArrayBuffer(totalLength)
		const resultView = new Uint8Array(result)

		resultView.set(new Uint8Array(header), 0)
		let offset = header.byteLength

		for (const chunk of trackChunks) {
			resultView.set(new Uint8Array(chunk), offset)
			offset += chunk.byteLength
		}

		return result
	}

	private createTrackChunk(track: MidiTrack): ArrayBuffer {
		// Simplified track chunk creation
		const events: number[] = []

		// Add track name if it exists
		if (track.name) {
			events.push(0x00, 0xff, 0x03, track.name.length, ...Array.from(new TextEncoder().encode(track.name)))
		}

		// Add note events (simplified)
		for (const event of track.events) {
			if (event.type === 'note' && event.note !== undefined && event.velocity !== undefined) {
				// Note on
				events.push(0x00, 0x90 | track.channel, event.note, event.velocity)
				// Note off (simplified timing)
				events.push(0x60, 0x80 | track.channel, event.note, 0)
			}
		}

		// End of track
		events.push(0x00, 0xff, 0x2f, 0x00)

		const trackData = new ArrayBuffer(8 + events.length)
		const view = new DataView(trackData)

		// "MTrk" header
		view.setUint32(0, 0x4d54726b) // "MTrk"
		view.setUint32(4, events.length) // Track length

		// Track data
		const dataView = new Uint8Array(trackData, 8)
		dataView.set(events)

		return trackData
	}

	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer)
		let binary = ''
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i])
		}
		return btoa(binary)
	}
}

// Main export function
export function smidi(input: string | MidiJSON | ArrayBuffer): SMidiConverter {
	return new SMidiConverter(input)
}

// Example usage:
/*
import { smidi } from './smidi';

// From sMIDI string
*/

// const smidiContent = `$SMIDI
// name=my song
// bpm=86
// ppq=96
// signature=4,4
// $TRACK
// id=1
// name=Track 1
// channel=1
// [N=G3 T=0 D=0.6975 V=705]
// [N=C4 T=0 D=0.6985 V=777]
// [N=G3 T=4798 D=0.5384 V=649]
// [N=C4 T=4798 D=0.5384 V=563]
// [N=G#4 T=8637 D=0.4880 V=705]
// [N=C4 T=8637 D=0.4880 V=777]
// [N=G#4 T=11995 D=1.02616 V=649]
// [N=C4 T=11995 D=1.02616 V=563]
// [N=F2 T=19192 D=0.6973 V=705]
// [N=F3 T=19192 D=0.6973 V=777]
// [N=F2 T=23990 D=0.5380 V=649]
// [N=F3 T=23990 D=0.5380 V=563]
// [N=D#2 T=27829 D=0.4880 V=705]
// [N=D#3 T=27829 D=0.4880 V=777]
// [N=D#2 T=31187 D=1.04607 V=649]
// [N=D#3 T=31187 D=1.04607 V=563]`

const smidiContent = `$SMIDI
name=Fading Echoes
bpm=130
ppq=480
signature=4,4
$TRACK
id=1
name=Piano
channel=0
[N=C2 T=0 D=3.8 V=500]
[N=C3 T=0 D=3.8 V=500]
[N=G3 T=0 D=3.5 V=600]
[N=C4 T=0 D=3.5 V=600]
[N=Eb4 T=0 D=3.5 V=600]
[N=Ab2 T=1920 D=3.8 V=550]
[N=Ab3 T=1920 D=3.8 V=550]
[N=C4 T=1920 D=3.5 V=620]
[N=Eb4 T=1920 D=3.5 V=620]
[N=Ab4 T=1920 D=3.5 V=620]
[N=C2 T=3840 D=1.8 V=650]
[N=C2 T=4800 D=1.8 V=650]
[N=G3 T=3840 D=1.0 V=700]
[N=Eb4 T=3840 D=1.0 V=700]
[N=G4 T=3840 D=1.0 V=700]
[N=G3 T=4560 D=1.0 V=680]
[N=Eb4 T=4560 D=1.0 V=680]
[N=G4 T=4560 D=1.0 V=680]
[N=Ab2 T=5760 D=1.8 V=650]
[N=Ab2 T=6720 D=1.8 V=650]
[N=Ab3 T=5760 D=1.0 V=700]
[N=C4 T=5760 D=1.0 V=700]
[N=Eb4 T=5760 D=1.0 V=700]
[N=Ab3 T=6480 D=1.0 V=680]
[N=C4 T=6480 D=1.0 V=680]
[N=Eb4 T=6480 D=1.0 V=680]
[N=Eb2 T=7680 D=1.8 V=650]
[N=Eb2 T=8640 D=1.8 V=650]
[N=G3 T=7680 D=1.0 V=700]
[N=Bb3 T=7680 D=1.0 V=700]
[N=Eb4 T=7680 D=1.0 V=700]
[N=G3 T=8400 D=1.0 V=680]
[N=Bb3 T=8400 D=1.0 V=680]
[N=Eb4 T=8400 D=1.0 V=680]
[N=Bb1 T=9600 D=1.8 V=650]
[N=Bb1 T=10560 D=1.8 V=650]
[N=F3 T=9600 D=1.0 V=700]
[N=Bb3 T=9600 D=1.0 V=700]
[N=D4 T=9600 D=1.0 V=700]
[N=F3 T=10320 D=1.0 V=680]
[N=Bb3 T=10320 D=1.0 V=680]
[N=D4 T=10320 D=1.0 V=680]
[N=F2 T=11520 D=3.8 V=580]
[N=F3 T=11520 D=3.5 V=620]
[N=Ab3 T=11520 D=3.5 V=620]
[N=C4 T=11520 D=3.5 V=620]
[N=Ab2 T=13440 D=3.8 V=580]
[N=Eb3 T=13440 D=3.5 V=620]
[N=Ab3 T=13440 D=3.5 V=620]
[N=C4 T=13440 D=3.5 V=620]
[N=Eb2 T=15360 D=3.8 V=580]
[N=G3 T=15360 D=3.5 V=620]
[N=Bb3 T=15360 D=3.5 V=620]
[N=Eb4 T=15360 D=3.5 V=620]
[N=G2 T=17280 D=1.9 V=600]
[N=G3 T=17280 D=1.9 V=640]
[N=C4 T=17280 D=1.9 V=640]
[N=D4 T=17280 D=1.9 V=640]
[N=G2 T=18240 D=1.9 V=650]
[N=G3 T=18240 D=1.9 V=680]
[N=B3 T=18240 D=1.9 V=680]
[N=D4 T=18240 D=1.9 V=680]
[N=C2 T=19200 D=1.0 V=850]
[N=C3 T=19200 D=1.0 V=850]
[N=C2 T=20160 D=1.0 V=850]
[N=C3 T=20160 D=1.0 V=850]
[N=G4 T=19200 D=0.5 V=800]
[N=C5 T=19200 D=0.5 V=800]
[N=Eb5 T=19200 D=0.5 V=800]
[N=G4 T=19920 D=0.5 V=780]
[N=C5 T=19920 D=0.5 V=780]
[N=Eb5 T=19920 D=0.5 V=780]
[N=G4 T=20160 D=0.5 V=800]
[N=C5 T=20160 D=0.5 V=800]
[N=Eb5 T=20160 D=0.5 V=800]
[N=G4 T=20880 D=0.5 V=780]
[N=C5 T=20880 D=0.5 V=780]
[N=Eb5 T=20880 D=0.5 V=780]
[N=Ab2 T=21120 D=1.0 V=850]
[N=Ab3 T=21120 D=1.0 V=850]
[N=Ab2 T=22080 D=1.0 V=850]
[N=Ab3 T=22080 D=1.0 V=850]
[N=Ab4 T=21120 D=0.5 V=800]
[N=C5 T=21120 D=0.5 V=800]
[N=Eb5 T=21120 D=0.5 V=800]
[N=Ab4 T=21840 D=0.5 V=780]
[N=C5 T=21840 D=0.5 V=780]
[N=Eb5 T=21840 D=0.5 V=780]
[N=Ab4 T=22080 D=0.5 V=800]
[N=C5 T=22080 D=0.5 V=800]
[N=Eb5 T=22080 D=0.5 V=800]
[N=Ab4 T=22800 D=0.5 V=780]
[N=C5 T=22800 D=0.5 V=780]
[N=Eb5 T=22800 D=0.5 V=780]
[N=Eb3 T=23040 D=1.0 V=850]
[N=Eb4 T=23040 D=1.0 V=850]
[N=Eb3 T=24000 D=1.0 V=850]
[N=Eb4 T=24000 D=1.0 V=850]
[N=G4 T=23040 D=0.5 V=800]
[N=Bb4 T=23040 D=0.5 V=800]
[N=Eb5 T=23040 D=0.5 V=800]
[N=G4 T=23760 D=0.5 V=780]
[N=Bb4 T=23760 D=0.5 V=780]
[N=Eb5 T=23760 D=0.5 V=780]
[N=G4 T=24000 D=0.5 V=800]
[N=Bb4 T=24000 D=0.5 V=800]
[N=Eb5 T=24000 D=0.5 V=800]
[N=G4 T=24720 D=0.5 V=780]
[N=Bb4 T=24720 D=0.5 V=780]
[N=Eb5 T=24720 D=0.5 V=780]
[N=Bb2 T=24960 D=1.0 V=850]
[N=Bb3 T=24960 D=1.0 V=850]
[N=Bb2 T=25920 D=1.0 V=850]
[N=Bb3 T=25920 D=1.0 V=850]
[N=F4 T=24960 D=0.5 V=800]
[N=Bb4 T=24960 D=0.5 V=800]
[N=D5 T=24960 D=0.5 V=800]
[N=F4 T=25680 D=0.5 V=780]
[N=Bb4 T=25680 D=0.5 V=780]
[N=D5 T=25680 D=0.5 V=780]
[N=F4 T=25920 D=0.5 V=800]
[N=Bb4 T=25920 D=0.5 V=800]
[N=D5 T=25920 D=0.5 V=800]
[N=F4 T=26640 D=0.5 V=780]
[N=Bb4 T=26640 D=0.5 V=780]
[N=D5 T=26640 D=0.5 V=780]
[N=C2 T=26880 D=1.0 V=860]
[N=C3 T=26880 D=1.0 V=860]
[N=C2 T=27840 D=1.0 V=860]
[N=C3 T=27840 D=1.0 V=860]
[N=G4 T=26880 D=0.5 V=820]
[N=C5 T=26880 D=0.5 V=820]
[N=Eb5 T=26880 D=0.5 V=820]
[N=G4 T=27600 D=0.5 V=800]
[N=C5 T=27600 D=0.5 V=800]
[N=Eb5 T=27600 D=0.5 V=800]
[N=G4 T=27840 D=0.5 V=820]
[N=C5 T=27840 D=0.5 V=820]
[N=Eb5 T=27840 D=0.5 V=820]
[N=G4 T=28560 D=0.5 V=800]
[N=C5 T=28560 D=0.5 V=800]
[N=Eb5 T=28560 D=0.5 V=800]
[N=Ab2 T=28800 D=1.0 V=860]
[N=Ab3 T=28800 D=1.0 V=860]
[N=Ab2 T=29760 D=1.0 V=860]
[N=Ab3 T=29760 D=1.0 V=860]
[N=Ab4 T=28800 D=0.5 V=820]
[N=C5 T=28800 D=0.5 V=820]
[N=Eb5 T=28800 D=0.5 V=820]
[N=Ab4 T=29520 D=0.5 V=800]
[N=C5 T=29520 D=0.5 V=800]
[N=Eb5 T=29520 D=0.5 V=800]
[N=Ab4 T=29760 D=0.5 V=820]
[N=C5 T=29760 D=0.5 V=820]
[N=Eb5 T=29760 D=0.5 V=820]
[N=Ab4 T=30480 D=0.5 V=800]
[N=C5 T=30480 D=0.5 V=800]
[N=Eb5 T=30480 D=0.5 V=800]
[N=Eb3 T=30720 D=1.0 V=860]
[N=Eb4 T=30720 D=1.0 V=860]
[N=Eb3 T=31680 D=1.0 V=860]
[N=Eb4 T=31680 D=1.0 V=860]
[N=G4 T=30720 D=0.5 V=820]
[N=Bb4 T=30720 D=0.5 V=820]
[N=Eb5 T=30720 D=0.5 V=820]
[N=G4 T=31440 D=0.5 V=800]
[N=Bb4 T=31440 D=0.5 V=800]
[N=Eb5 T=31440 D=0.5 V=800]
[N=G4 T=31680 D=0.5 V=820]
[N=Bb4 T=31680 D=0.5 V=820]
[N=Eb5 T=31680 D=0.5 V=820]
[N=G4 T=32400 D=0.5 V=800]
[N=Bb4 T=32400 D=0.5 V=800]
[N=Eb5 T=32400 D=0.5 V=800]
[N=Bb2 T=32640 D=1.0 V=860]
[N=Bb3 T=32640 D=1.0 V=860]
[N=Bb2 T=33600 D=1.0 V=860]
[N=Bb3 T=33600 D=1.0 V=860]
[N=F4 T=32640 D=0.5 V=820]
[N=Bb4 T=32640 D=0.5 V=820]
[N=D5 T=32640 D=0.5 V=820]
[N=F4 T=33360 D=0.5 V=800]
[N=Bb4 T=33360 D=0.5 V=800]
[N=D5 T=33360 D=0.5 V=800]
[N=F4 T=33600 D=0.5 V=820]
[N=Bb4 T=33600 D=0.5 V=820]
[N=D5 T=33600 D=0.5 V=820]
[N=F4 T=34320 D=0.5 V=800]
[N=Bb4 T=34320 D=0.5 V=800]
[N=D5 T=34320 D=0.5 V=800]
[N=C2 T=34560 D=4.0 V=900]
[N=C3 T=34560 D=4.0 V=900]
[N=G3 T=34560 D=4.0 V=850]
[N=C4 T=34560 D=4.0 V=850]
[N=Eb4 T=34560 D=4.0 V=850]
[N=Eb5 T=960 D=0.5 V=700]
[N=D5 T=1200 D=0.5 V=680]
[N=C5 T=1440 D=1.0 V=720]
[N=C5 T=2880 D=1.0 V=700]
[N=C4 T=3840 D=0.75 V=750]
[N=D4 T=4200 D=0.5 V=730]
[N=Eb4 T=4440 D=1.25 V=760]
[N=C4 T=6000 D=1.0 V=750]
[N=C4 T=6480 D=0.5 V=730]
[N=Bb3 T=6720 D=1.5 V=760]
[N=G4 T=7680 D=0.75 V=750]
[N=F4 T=8040 D=0.5 V=730]
[N=Eb4 T=8280 D=1.75 V=760]
[N=D4 T=9840 D=0.5 V=740]
[N=C4 T=10080 D=1.0 V=720]
[N=D4 T=10560 D=1.0 V=760]
[N=F4 T=11520 D=3.0 V=680]
[N=Eb4 T=13440 D=3.0 V=680]
[N=G4 T=15360 D=2.0 V=700]
[N=D5 T=17280 D=3.5 V=780]
[N=Eb5 T=19200 D=1.0 V=900]
[N=Eb5 T=20160 D=0.5 V=880]
[N=F5 T=20400 D=0.5 V=890]
[N=G5 T=20640 D=1.0 V=920]
[N=F5 T=21120 D=2.0 V=900]
[N=Eb5 T=22080 D=1.5 V=880]
[N=D5 T=23040 D=1.0 V=890]
[N=D5 T=24000 D=0.5 V=880]
[N=C5 T=24240 D=0.5 V=870]
[N=D5 T=24480 D=1.0 V=910]
[N=C5 T=24960 D=2.0 V=900]
[N=Bb4 T=25920 D=1.5 V=870]
[N=G5 T=26880 D=1.0 V=950]
[N=G5 T=27840 D=0.5 V=930]
[N=F5 T=28080 D=0.5 V=940]
[N=Eb5 T=28320 D=1.0 V=920]
[N=F5 T=28800 D=2.0 V=930]
[N=Eb5 T=29760 D=1.0 V=900]
[N=C5 T=30240 D=0.5 V=880]
[N=Bb4 T=30720 D=0.5 V=910]
[N=C5 T=30960 D=0.5 V=900]
[N=D5 T=31200 D=1.5 V=940]
[N=D5 T=31920 D=0.5 V=890]
[N=C5 T=32640 D=4.0 V=950]`

const converter = smidi(smidiContent)
const midiJson = converter.toJSON()
const midiBase64 = converter.toBase64()
const midiDataUri = converter.toDataUri()

// In Node.js with fs access:
// converter.toMidi('./output.mid');

// From MIDI JSON back to sMIDI
const backToSmidi = smidi(midiJson).toSmidi()

console.log({
	backToSmidi,
	midiBase64,
	midiDataUri,
	midiJson,
})

converter.toMidi('./output.mid')
