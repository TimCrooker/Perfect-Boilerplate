import { ActionButton, SuperImage } from '@/components/core'
import { Feature as FeatureType } from '@/features'
import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import { FeatureWrapper } from './styles'

interface FeatureProps {
	feature: FeatureType
}

export function Feature({ feature }: FeatureProps): React.ReactElement {
	return (
		<FeatureWrapper className="col col--2">
			<div className="text--center">
				<SuperImage publicId={feature.publicId} imageUrl={feature.imageUrl} />
			</div>
			<h3 className="text--center">{feature.title}</h3>
		</FeatureWrapper>
	)
}

interface FeatureShowcaseProps {
	data: FeatureType[]
	imageSize?: number
}

export function FeatureShowcase({
	data,
}: FeatureShowcaseProps): React.ReactElement {
	return (
		<>
			{data?.map((feature) => {
				return <Feature feature={feature} />
			})}
		</>
	)
}

export function HomeCallToAction(): React.ReactElement {
	return (
		<>
			<ActionButton
				type="primary"
				href={useBaseUrl('docs/getting-started')}
				target="_self"
			>
				Get started
			</ActionButton>
			<ActionButton
				type="secondary"
				href={useBaseUrl('docs/tutorial')}
				target="_self"
			>
				Learn basics
			</ActionButton>
		</>
	)
}
