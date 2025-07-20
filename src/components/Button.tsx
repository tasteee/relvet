import { Button as RadixButton } from '@radix-ui/themes'
import './Button.css'
import classNames from 'classnames'

type PropsT = React.ComponentProps<typeof RadixButton> & {
	kind?: 'solid' | 'subtle' | 'outline' | 'ghost'
}

export const Button = (props: PropsT) => {
	const kindClass = props.kind || 'solid'
	const colorClass = props.color || ''
	const className = classNames('Button', kindClass, colorClass, props.className)
	return <RadixButton {...props} className={className} />
}
