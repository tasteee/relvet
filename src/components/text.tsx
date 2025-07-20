import React, { JSX } from 'react'
import classNames from 'classnames'

type TextPropsT = CommonPropsT & {
	as?: keyof JSX.IntrinsicElements
}

const textClasses = {
	sub: 'Text subText text-sm',
	p: 'Text pText text-base',
	h3: 'Text h3Text text-lg font-semibold',
	h2: 'Text h2Text text-xl font-semibold',
	h1: 'Text h1Text text-2xl font-bold',
}

const textElements = {
	sub: 'p',
	p: 'p',
	h3: 'h3',
	h2: 'h2',
	h1: 'h1',
}

const p = (props: TextPropsT) => {
	const { as, ...otherProps } = props
	const Component = textElements[as] || 'p'
	const baseClass = textClasses[as] || 'Text pText text-base'
	const className = classNames(baseClass, props.className)
	return <Component className={className} {...otherProps} />
}

const h1 = (props: TextPropsT) => {
	return <text.p as='h1' {...props} />
}

const h2 = (props: TextPropsT) => {
	return <text.p as='h2' {...props} />
}

const h3 = (props: TextPropsT) => {
	return <text.p as='h3' {...props} />
}

const sub = (props: TextPropsT) => {
	return <text.p as='sub' {...props} />
}

export const text = {
	p,
	h1,
	h2,
	h3,
	sub,
}

export const Text = text
