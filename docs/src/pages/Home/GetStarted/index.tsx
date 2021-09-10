import React from 'react'
import { HomeCallToAction } from '../..'
import { Section, Heading } from '../../../components/core'
import './style.scss'

function GetStarted(): React.ReactElement {
	return (
		<Section className="GetStarted" background="dark">
			<div className="content">
				<Heading text="Give it a try" />
				<ol className="steps">
					<li>
						<p>Run this</p>
						<div className="terminal">
							<code>npx react-native init MyTestApp</code>
						</div>
					</li>
					<li>
						<p>Read these</p>
						<HomeCallToAction />
					</li>
				</ol>
			</div>
		</Section>
	)
}

export default GetStarted
