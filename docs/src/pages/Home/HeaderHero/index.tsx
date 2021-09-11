import React from 'react'
import { TwoColumns } from '../../../components/core'
import { HomeCallToAction } from '../components'
import { HeaderHeroWrapper } from './styles'

function HeaderHero(): React.ReactElement {
	return (
		<HeaderHeroWrapper background="dark">
			<TwoColumns
				reverse
				columnOne={<div>hello im a logo</div>}
				columnTwo={
					<>
						<h1 className="title">Perfect Boilerplate</h1>
						<p className="tagline">Write Code, Not Boilerplate</p>
						<div className="buttons">
							<HomeCallToAction />
						</div>
					</>
				}
			/>
		</HeaderHeroWrapper>
	)
}

export default HeaderHero
