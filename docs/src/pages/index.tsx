import React from 'react'
import Layout from '@theme/Layout'
import HeaderHero from './Home/HeaderHero'
import Plugins from './Home/Plugin'
import GetStarted from './Home/GetStarted'
import Frameworks from './Home/Frameworks'
import BestPractices from './Home/BestPractices'
import Databases from './Home/Databases'

function HomeWrapper(): React.ReactElement {
	return (
		<Layout
			description="Description will go into a meta tag in <head />"
			wrapperClassName="homepage"
		>
			<HeaderHero />
			<main>
				<Frameworks />
				<Databases />
				<Plugins />
				<BestPractices />
				<GetStarted />
			</main>
		</Layout>
	)
}

export default HomeWrapper
