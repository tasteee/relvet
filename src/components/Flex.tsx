import React from 'react'
import { Flex as RadixFlex, FlexProps } from '@radix-ui/themes'

type PropsT = FlexProps & {
	testId?: string
	ref?: React.Ref<HTMLDivElement>
}

const FlexBox = (componentId: string, direction: string) => {
	const Component = (props: PropsT) => {
		const { testId, ...otherProps } = props
		const updatedProps = { ...otherProps, direction } as FlexProps
		return <RadixFlex ref={props.ref} {...updatedProps} data-testid={props.testId} />
	}

	Component.displayName = componentId
	return Component
}

export const Flex = {
	Row: FlexBox('Flex.Row', 'row'),
	Column: FlexBox('Flex.Column', 'column'),
}
