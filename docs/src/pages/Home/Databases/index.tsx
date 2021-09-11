import { databases } from '@/features'
import React from 'react'
import { FeatureShowcase } from '../components'
import { DatabasesWrapper } from './styles'

function Databases(): React.ReactElement {
	return (
		<DatabasesWrapper background="light">
			<div className="container">
				<div className="row">
					<FeatureShowcase data={databases} />
				</div>
			</div>
		</DatabasesWrapper>
	)
}

export default Databases
