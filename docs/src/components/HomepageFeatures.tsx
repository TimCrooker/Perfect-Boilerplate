import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'
import { Image, CloudinaryContext } from 'cloudinary-react'
import IMAGES from '../../static/img/images'

const FeatureList = [
	{
		title: 'Easy to Use',
		Svg: <Image publicId={IMAGES.full_logo} />,
		description: (
			<>
				Docusaurus was designed from the ground up to be easily
				installed and used to get your website up and running quickly.
			</>
		),
	},
	{
		title: 'Focus on What Matters',
		Svg: <Image publicId={IMAGES.full_logo} />,
		description: (
			<>
				Docusaurus lets you focus on your docs, and we&apos;ll do the
				chores. Go ahead and move your docs into the <code>docs</code>{' '}
				directory.
			</>
		),
	},
	{
		title: 'Powered by React',
		Svg: <Image publicId={IMAGES.full_logo} />,
		description: (
			<>
				Extend or customize your website layout by reusing React.
				Docusaurus can be extended while reusing the same header and
				footer.
			</>
		),
	},
]

function Feature({ Svg, title, description }) {
	return (
		<div className={clsx('col col--4')}>
			<CloudinaryContext cloudName="dfmg5c8l9" secure="true" width="300">
				<div className="text--center">{Svg}</div>
			</CloudinaryContext>
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	)
}

const HomepageFeatures: React.FC = () => {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, index) => (
						<Feature key={index} {...props} />
					))}
				</div>
			</div>
		</section>
	)
}

export default HomepageFeatures
