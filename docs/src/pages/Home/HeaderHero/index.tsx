import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import { Section, TwoColumns, LogoAnimation, ActionButton } from '../../../components/core'
import './style.scss'

function HomeCallToAction(): React.ReactElement {
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

function HeaderHero(): React.ReactElement {
	return (
		<Section background="dark" className="HeaderHero">
			<TwoColumns
				reverse
				columnOne={<LogoAnimation />}
				columnTwo={
					<>
						<h1 className="title">React Native</h1>
						<p className="tagline">Learn once, write&nbsp;anywhere.</p>
						<div className="buttons">
							<HomeCallToAction />
						</div>
					</>
				}
			/>
		</Section>
	)
}

export default HeaderHero
