import { colors } from './colors'

const fonts = {
	baseSize: '14px',
	scaleRatio: 1.2,
	lineHeightRatio: 1.2,

	families: {
		// 0: 'var(--fontArticulatCF)',
		// 1: 'var(--fontArticulatCF)',
		0: 'Instrument Sans',
		1: 'DM Sans',
	},

	weights: {
		0: '400',
		1: '500',
		2: '700',
	},
}

const typography = {
	h1: {
		fontFamily: fonts.families[1],
		fontSize: '3rem',
		fontWeight: '700',
		lineHeight: '3.57rem',
		letterSpacing: '-1px',
	},
	h2: {
		fontFamily: fonts.families[1],
		fontSize: '2.07rem',
		fontWeight: '700',
		lineHeight: '2.5rem',
		letterSpacing: '-1px',
	},
	h3: {
		fontFamily: fonts.families[1],
		fontSize: '1.71rem',
		fontWeight: '700',
		lineHeight: '2.07rem',
		letterSpacing: '-1px',
	},
	h4: {
		fontFamily: fonts.families[1],
		fontSize: '1.43rem',
		fontWeight: '600',
		lineHeight: '1.71rem',
		letterSpacing: '0px',
	},
	h5: {
		fontFamily: fonts.families[0],
		fontSize: '1.21rem',
		fontWeight: '600',
		lineHeight: '1.43rem',
		letterSpacing: '0px',
	},
	h6: {
		fontFamily: fonts.families[0],
		fontSize: '1rem',
		fontWeight: '600',
		lineHeight: '1.21rem',
		letterSpacing: '0px',
	},
	body: {
		fontFamily: fonts.families[0],
		fontSize: '1rem',
		fontWeight: '400',
		lineHeight: '1.21rem',
		letterSpacing: '0px',
	},
}

export const $ = {
	fonts,

	typography,

	colors,
}

export default $
