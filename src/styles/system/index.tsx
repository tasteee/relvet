import { styled } from 'styled-components'
import { $ } from './tokens'

export const getColor = (index, key?: string) => (props) => {
	if (key) return $.colors[key][index] || $.colors[key][9]
	const color = $.colors[props.color] || $.colors.gray
	return color[index] || color[9]
}

const H1 = styled.h1`
	font-weight: ${$.typography.h1.fontWeight};
	font-size: ${$.typography.h1.fontSize};
	line-height: ${$.typography.h1.lineHeight};
	letter-spacing: ${$.typography.h1.letterSpacing};
`

const H2 = styled.h2`
	font-weight: ${$.typography.h2.fontWeight};
	font-size: ${$.typography.h2.fontSize};
	line-height: ${$.typography.h2.lineHeight};
	letter-spacing: ${$.typography.h2.letterSpacing};
`
const H3 = styled.h3`
	font-weight: ${$.typography.h3.fontWeight};
	font-size: ${$.typography.h3.fontSize};
	line-height: ${$.typography.h3.lineHeight};
	letter-spacing: ${$.typography.h3.letterSpacing};
`

const H4 = styled.h4`
	font-weight: ${$.typography.h4.fontWeight};
	font-size: ${$.typography.h4.fontSize};
	line-height: ${$.typography.h4.lineHeight};
	letter-spacing: ${$.typography.h4.letterSpacing};
`

const P = styled.p`
	font-weight: ${$.typography.body.fontWeight};
	font-size: ${$.typography.body.fontSize};
	line-height: ${$.typography.body.lineHeight};
	letter-spacing: ${$.typography.body.letterSpacing};
	-webkit-text-size-adjust: 100%;
	margin: 0;
	padding: 0;
	vertical-align: baseline;
	font-size: 16px;
	line-height: 1.5;
	font-weight: 400;
`
const Small = styled.small`
	font-size: 12px;
	font-weight: ${$.typography.body.fontWeight};
	line-height: ${$.typography.body.lineHeight};
	letter-spacing: ${$.typography.body.letterSpacing};
`

const Bold = styled.strong`
	font-weight: 700;
	font-size: ${$.typography.body.fontSize};
	line-height: ${$.typography.body.lineHeight};
	letter-spacing: ${$.typography.body.letterSpacing};
`
const Italic = styled.em`
	font-weight: ${$.typography.body.fontWeight};
	font-size: ${$.typography.body.fontSize};
	line-height: ${$.typography.body.lineHeight};
	letter-spacing: ${$.typography.body.letterSpacing};
	font-style: italic;
`

export const Typography = {
	H1,
	H2,
	H3,
	H4,
	P,
	Small,
	Bold,
	Italic,
}
