import React from 'react'
import { textContent } from '../..'
import IMAGES, { cloudinaryUrl } from '../../../../static/img/images'
import { Section, TwoColumns, TextColumn } from '../../../components/core'

function NativeApps(): React.ReactElement {
	return (
		<Section className="NativeApps" background="light">
			<TwoColumns
				reverse
				columnOne={
					<TextColumn
						title="Create native apps for Android and iOS using React"
						text={textContent.intro}
					/>
				}
				columnTwo={<img alt="" src={cloudinaryUrl(IMAGES.full_logo)} />}
			/>
		</Section>
	)
}

export default NativeApps
