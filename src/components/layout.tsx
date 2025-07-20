import classNames from 'classnames'
import { JSX, ReactNode } from 'react'

type PropsT = {
	children?: ReactNode
	className?: string
	wrap?: boolean
	p?: string | number
	px?: string | number
	py?: string | number
	mx?: string | number
	my?: string | number
	m?: string | number
	pt?: string | number
	pb?: string | number
	pl?: string | number
	pr?: string | number
	mt?: string | number
	mb?: string | number
	ml?: string | number
	mr?: string | number
	as?: keyof JSX.IntrinsicElements
	width?: string | number
	height?: string | number
	border?: string | number
	radius?: string | number
	display?: string
	flex?: boolean
	direction?: 'row' | 'column'
	xAlign?: 'start' | 'center' | 'end' | 'between' | 'around'
	yAlign?: 'start' | 'center' | 'end'
	gap?: string | number
}

const groupProps = (props: any, keys: string[]) => {
	const grouped: Record<string, any> = {}
	const otherProps = { ...props }

	for (const key of keys) {
		grouped[key] = props[key]
		delete otherProps[key]
	}

	return { grouped, otherProps }
}

const Layout = (props: PropsT) => {
	const direction = props.direction || 'row'
	const isColumn = direction === 'column'
	const justifyAlign = isColumn ? props.yAlign : props.xAlign
	const itemsAlign = isColumn ? props.xAlign : props.yAlign
	const directionClass = `Layout-${direction}`
	const Component = props.as || ('div' as any)
	const display = props.display || 'flex'
	const flexClass = display === 'flex' ? 'flex' : ''
	const flexDirClass = `flex-${direction === 'column' ? 'col' : 'row'}`
	const wrap = props.wrap || false

	const classes = classNames('Layout', directionClass, flexDirClass, props.className, flexClass, {
		[`p-${props.p}`]: props.p,
		[`m-${props.m}`]: props.m,
		[`pt-${props.pt}`]: props.pt,
		[`pb-${props.pb}`]: props.pb,
		[`pl-${props.pl}`]: props.pl,
		[`pr-${props.pr}`]: props.pr,
		[`mt-${props.mt}`]: props.mt,
		[`mb-${props.mb}`]: props.mb,
		[`ml-${props.ml}`]: props.ml,
		[`mr-${props.mr}`]: props.mr,
		[`w-${props.width}`]: props.width,
		[`h-${props.height}`]: props.height,
		[`border-${props.border}`]: props.border,
		[`radius-${props.radius}`]: props.radius,
		[`flex-${direction}`]: direction,
		[`gap-${props.gap}`]: props.gap,
		[`justify-${justifyAlign}`]: justifyAlign,
		[`items-${itemsAlign}`]: itemsAlign,
		'flex-wrap': wrap,
		flex: true,
	})

	const { otherProps } = groupProps(props, [
		'p',
		'm',
		'pt',
		'pb',
		'pl',
		'pr',
		'mt',
		'mb',
		'ml',
		'mr',
		'mx',
		'my',
		'px',
		'py',
		'as',
		'width',
		'height',
		'border',
		'radius',
		'display',
		'direction',
		'xAlign',
		'yAlign',
		'gap',
		'wrap',
	])

	return <Component {...otherProps} className={classes} />
}

type SpacerPropsT = {
	width?: string | number
	height?: string | number
	size?: string | number
	block?: boolean
}

const Spacer = (props: SpacerPropsT) => {
	const Component = props.block ? 'div' : 'span'
	const width = props.width || props.size || ''
	const height = props.height || props.size || props.width || ''
	return <Component style={{ width, height }} />
}

const Row = (props: PropsT) => {
	return <Layout {...props} direction='row' />
}

const Column = (props: PropsT) => {
	return <Layout {...props} direction='column' />
}

export const layout = {
	row: Row,
	column: Column,
	spacer: Spacer,
}

export const Box = layout
