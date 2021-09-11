import React from 'react'
import { PluginsWrapper } from './styles'
import { FeatureShowcase } from '../components'
import { plugins } from '@/features'

function Plugins(): React.ReactElement {
	return (
		<PluginsWrapper background="light">
			<div className="container">
				<div className="row">
					<FeatureShowcase data={plugins} />
				</div>
			</div>
		</PluginsWrapper>
	)
}

export default Plugins
