import { frameworks } from '@/features'
import React from 'react'
import { FeatureShowcase } from '../components'
import { FrameworksWrapper } from './styles'

function Frameworks(): React.ReactElement {
	return (
		<FrameworksWrapper background="light">
			<div className="container">
				<div className="row">
					<FeatureShowcase data={frameworks} />
				</div>
			</div>
		</FrameworksWrapper>
	)
}

export default Frameworks
