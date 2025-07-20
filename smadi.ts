import { Midi } from '@tonejs/midi'

// Type definitions for the input structure
interface ChordData {
	inversion: string
	octaveOffset: string
	symbol: string
	voicing: string
}

interface ProgressionResult {
	chords: ChordData[]
	justification: string
}

interface ChordProgressionInput {
	results: ProgressionResult[]
}

// Chord symbol to note mapping
const CHORD_NOTES: { [key: string]: number[] } = {
	// Major chords
	C: [0, 4, 7],
	'C#': [1, 5, 8],
	Db: [1, 5, 8],
	D: [2, 6, 9],
	'D#': [3, 7, 10],
	Eb: [3, 7, 10],
	E: [4, 8, 11],
	F: [5, 9, 0],
	'F#': [6, 10, 1],
	Gb: [6, 10, 1],
	G: [7, 11, 2],
	'G#': [8, 0, 3],
	Ab: [8, 0, 3],
	A: [9, 1, 4],
	'A#': [10, 2, 5],
	Bb: [10, 2, 5],
	B: [11, 3, 6],

	// Minor chords
	Cm: [0, 3, 7],
	'C#m': [1, 4, 8],
	Dm: [2, 5, 9],
	'D#m': [3, 6, 10],
	Em: [4, 7, 11],
	Fm: [5, 8, 0],
	'F#m': [6, 9, 1],
	Gm: [7, 10, 2],
	'G#m': [8, 11, 3],
	Am: [9, 0, 4],
	'A#m': [10, 1, 5],
	Bm: [11, 2, 6],

	// Diminished chords
	'C°': [0, 3, 6],
	'C#°': [1, 4, 7],
	'D°': [2, 5, 8],
	'D#°': [3, 6, 9],
	'E°': [4, 7, 10],
	'F°': [5, 8, 11],
	'F#°': [6, 9, 0],
	'G°': [7, 10, 1],
	'G#°': [8, 11, 2],
	'A°': [9, 0, 3],
	'A#°': [10, 1, 4],
	'B°': [11, 2, 5],

	// Augmented chords
	'C+': [0, 4, 8],
	'C#+': [1, 5, 9],
	'D+': [2, 6, 10],
	'D#+': [3, 7, 11],
	'E+': [4, 8, 0],
	'F+': [5, 9, 1],
	'F#+': [6, 10, 2],
	'G+': [7, 11, 3],
	'G#+': [8, 0, 4],
	'A+': [9, 1, 5],
	'A#+': [10, 2, 6],
	'B+': [11, 3, 7],
}

// Extended chord extensions
const CHORD_EXTENSIONS: { [key: string]: number[] } = {
	'7': [10],
	maj7: [11],
	'(maj7)': [11],
	'°7': [9],
	ø7: [10],
	'6': [9],
	'(b9)': [1],
	add9: [2],
	sus2: [-2, 2], // replaces 3rd with 2nd
	sus4: [-4, 5], // replaces 3rd with 4th
}

class ChordProgressionToMidi {
	private baseOctave = 4
	private chordDuration = 1.0 // 1 beat per chord
	private velocity = 80

	/**
	 * Parse a chord symbol and return the MIDI note numbers
	 */
	private parseChordSymbol(symbol: string, octave: number = this.baseOctave): number[] {
		// Clean the symbol and extract root, quality, and extensions
		let cleanSymbol = symbol.trim()
		let notes: number[] = []

		// Find the base chord
		let baseChord = ''
		let extensions = ''

		// Check for extended chords and complex symbols
		const complexMatches = cleanSymbol.match(/^([A-G][#b]?)(.*)$/)
		if (complexMatches) {
			const root = complexMatches[1]
			const remainder = complexMatches[2]

			// Try to match known chord types
			if (remainder.includes('°7')) {
				baseChord = root + '°'
				extensions = '°7'
			} else if (remainder.includes('ø7')) {
				baseChord = root + 'm'
				extensions = 'ø7'
			} else if (remainder.includes('maj7') || remainder.includes('(maj7)')) {
				baseChord = root
				extensions = 'maj7'
			} else if (remainder.includes('(b9)')) {
				baseChord = root + '7'
				extensions = '(b9)'
			} else if (remainder.includes('7')) {
				baseChord = root + '7'
				extensions = '7'
			} else if (remainder.includes('6')) {
				baseChord = root + (remainder.includes('m') ? 'm' : '')
				extensions = '6'
			} else if (remainder.includes('+')) {
				baseChord = root + '+'
			} else if (remainder.includes('°')) {
				baseChord = root + '°'
			} else if (remainder.includes('m')) {
				baseChord = root + 'm'
			} else {
				baseChord = root
			}
		}

		// Get base chord notes
		if (CHORD_NOTES[baseChord]) {
			notes = [...CHORD_NOTES[baseChord]]
		} else {
			console.warn(`Unknown chord: ${baseChord}`)
			// Default to root note only
			const rootNote = this.getRootNote(baseChord)
			notes = [rootNote]
		}

		// Add extensions
		if (extensions && CHORD_EXTENSIONS[extensions]) {
			const extensionNotes = CHORD_EXTENSIONS[extensions]
			extensionNotes.forEach((ext) => {
				if (ext > 0) {
					notes.push(ext)
				} else {
					// Handle replacements (like sus chords)
					const indexToReplace = notes.indexOf(Math.abs(ext))
					if (indexToReplace !== -1) {
						notes[indexToReplace] = ext + 12 // Add the replacement note
					}
				}
			})
		}

		// Convert to MIDI note numbers and add octave
		return notes.map((note) => {
			const normalizedNote = ((note % 12) + 12) % 12
			return normalizedNote + octave * 12
		})
	}

	private getRootNote(chordSymbol: string): number {
		const noteMap: { [key: string]: number } = {
			C: 0,
			'C#': 1,
			Db: 1,
			D: 2,
			'D#': 3,
			Eb: 3,
			E: 4,
			F: 5,
			'F#': 6,
			Gb: 6,
			G: 7,
			'G#': 8,
			Ab: 8,
			A: 9,
			'A#': 10,
			Bb: 10,
			B: 11,
		}

		for (const [note, value] of Object.entries(noteMap)) {
			if (chordSymbol.startsWith(note)) {
				return value
			}
		}
		return 0 // Default to C
	}

	/**
	 * Apply chord inversion
	 */
	private applyInversion(notes: number[], inversion: number): number[] {
		if (inversion === 0 || notes.length === 0) return notes

		const sortedNotes = [...notes].sort((a, b) => a - b)
		const result = [...sortedNotes]

		for (let i = 0; i < inversion && i < result.length; i++) {
			const note = result.shift()!
			result.push(note + 12) // Move to next octave
		}

		return result
	}

	/**
	 * Apply voicing adjustments
	 */
	private applyVoicing(notes: number[], voicing: string): number[] {
		const sortedNotes = [...notes].sort((a, b) => a - b)

		switch (voicing) {
			case 'open':
				// Spread notes across wider range
				return sortedNotes.map((note, index) => note + index * 3)

			case 'spread':
				// Even wider spreading
				return sortedNotes.map((note, index) => note + index * 5)

			case 'drop2':
				// Move second highest note down an octave
				if (sortedNotes.length >= 2) {
					const result = [...sortedNotes]
					result[result.length - 2] -= 12
					return result.sort((a, b) => a - b)
				}
				return sortedNotes

			case 'cluster':
				// Compress notes together
				return sortedNotes.map((note, index) => sortedNotes[0] + index)

			case 'closed':
			default:
				return sortedNotes
		}
	}

	/**
	 * Convert a single chord progression to MIDI
	 */
	public progressionToMidi(progression: ProgressionResult): Midi {
		const midi = new Midi()
		const track = midi.addTrack()

		let currentTime = 0

		progression.chords.forEach((chord, index) => {
			const octave = this.baseOctave + parseInt(chord.octaveOffset)
			const inversion = parseInt(chord.inversion)

			// Parse chord symbol to get note numbers
			let notes = this.parseChordSymbol(chord.symbol, octave)

			// Apply inversion
			notes = this.applyInversion(notes, inversion)

			// Apply voicing
			notes = this.applyVoicing(notes, chord.voicing)

			// Add notes to track
			notes.forEach((noteNumber) => {
				if (noteNumber >= 0 && noteNumber <= 127) {
					track.addNote({
						midi: noteNumber,
						time: currentTime,
						duration: this.chordDuration,
						velocity: this.velocity,
					})
				}
			})

			currentTime += this.chordDuration
		})

		return midi
	}

	/**
	 * Convert all progressions to MIDI files
	 */
	public async convertAllProgressions(input: ChordProgressionInput): Promise<{ midi: Midi; name: string; justification: string }[]> {
		const results: { midi: Midi; name: string; justification: string }[] = []

		input.results.forEach((progression, index) => {
			const midi = this.progressionToMidi(progression)
			const name = `progression_${index + 1}`

			results.push({
				midi,
				name,
				justification: progression.justification,
			})
		})

		return results
	}

	/**
	 * Get MIDI file as Uint8Array for download
	 */
	public getMidiBytes(midi: Midi): Uint8Array {
		return midi.toArray()
	}

	/**
	 * Write MIDI file to filesystem (Node.js/Bun)
	 */
	public async writeMidi(midi: Midi, fileName: string): Promise<void> {
		const bytes = this.getMidiBytes(midi)
		const finalFileName = fileName.endsWith('.mid') ? fileName : `${fileName}.mid`

		// Try Bun first
		try {
			const BunGlobal = (globalThis as any).Bun
			if (BunGlobal && BunGlobal.write) {
				await BunGlobal.write(finalFileName, bytes)
				return
			}
		} catch {
			// Continue to Node.js fallback
		}

		// Try Node.js
		try {
			const fsModule = (await eval(`import('fs/promises')`)) as any
			await fsModule.writeFile(finalFileName, bytes)
			return
		} catch {
			// Continue to alternative Node.js approach
		}

		// Alternative Node.js approach
		try {
			const fs = (await eval(`import('fs')`)) as any
			const util = (await eval(`import('util')`)) as any
			const writeFile = util.promisify(fs.writeFile)
			await writeFile(finalFileName, bytes)
			return
		} catch (error) {
			throw new Error('writeMidi method requires Node.js or Bun runtime environment. Error: ' + error)
		}
	}

	/**
	 * Utility method to download MIDI file in browser
	 */
	public downloadMidi(midi: Midi, filename: string): void {
		const bytes = this.getMidiBytes(midi)
		const blob = new Blob([bytes], { type: 'audio/midi' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = filename.endsWith('.mid') ? filename : `${filename}.mid`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}
}

// Export the converter class and types
export { ChordProgressionToMidi, ChordProgressionInput, ProgressionResult, ChordData }

// Usage example:
/*
const converter = new ChordProgressionToMidi();
const input = { results: [...] }; // Your chord progression data

// Convert all progressions
converter.convertAllProgressions(input).then(results => {
  results.forEach(({ midi, name, justification }) => {
    console.log(`${name}: ${justification}`);
    converter.downloadMidi(midi, name);
  });
});
*/

import data from './ai.json'
const converter = new ChordProgressionToMidi()

// Convert all progressions
converter.convertAllProgressions(data).then((results) => {
	results.forEach(({ midi, name, justification }) => {
		console.log(`${name}: ${justification}`)
		converter.writeMidi(midi, name || crypto.randomUUID() + '.mid')
	})
})
