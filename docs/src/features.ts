import {
	GetDatabaseLogoId,
	GetFeatureLogoId,
	GetFrameworkLogoId,
} from '../static/img/images'

export type Feature = {
	title: string
	publicId?: string
	imageUrl?: string
	link?: string
}

export const frameworks: Feature[] = [
	{
		publicId: GetFrameworkLogoId('react'),
		title: 'React',
	},
	{
		publicId: GetFrameworkLogoId('nextjs'),
		title: 'Next',
	},
	{
		publicId: GetFrameworkLogoId('angular'),
		title: 'Angular',
	},
	{
		publicId: GetFrameworkLogoId('react'),
		title: 'React Native',
	},
	{
		publicId: GetFrameworkLogoId('vue'),
		title: 'Vue',
	},
	{
		publicId: GetFrameworkLogoId('svelte'),
		title: 'Svelte',
	},
]

export const databases: Feature[] = [
	{
		publicId: GetDatabaseLogoId('mongodb'),
		title: 'MongoDB',
	},
	{
		publicId: GetDatabaseLogoId('mysql'),
		title: 'MySql',
	},
	{
		publicId: GetDatabaseLogoId('postgres'),
		title: 'PostgreSQL',
	},
]

export const plugins: Feature[] = [
	{
		publicId: GetFeatureLogoId('styled-components'),
		title: 'Styled-Components',
	},
	{
		publicId: GetFeatureLogoId('tailwind'),
		title: 'TailwindCSS',
	},
	{
		publicId: GetFeatureLogoId('element-ui'),
		title: 'Element-UI',
	},
	{
		publicId: GetFeatureLogoId('eslint'),
		title: 'ESLint',
	},
	{
		publicId: GetFeatureLogoId('stylelint'),
		title: 'StyleLint',
	},
	{
		publicId: GetFeatureLogoId('docker'),
		title: 'Docker',
	},
	{
		publicId: GetFeatureLogoId('css'),
		title: 'CSS',
	},
	{
		publicId: GetFeatureLogoId('bootstrap'),
		title: 'Bootstrap',
	},
	{
		publicId: GetFeatureLogoId('material-ui'),
		title: 'Material-UI',
	},
	{
		publicId: GetFeatureLogoId('cyclejs'),
		title: 'CycleJS',
	},
	{
		publicId: GetFeatureLogoId('redux'),
		title: 'Redux',
	},
	{
		publicId: GetFeatureLogoId('jquery'),
		title: 'jQuery',
	},
	{
		publicId: GetFeatureLogoId('javascript'),
		title: 'Javascript',
	},
	{
		publicId: GetFeatureLogoId('html'),
		title: 'HTML',
	},
	{
		publicId: GetFeatureLogoId('spring'),
		title: 'Spring',
	},
	{
		publicId: GetFeatureLogoId('webpack'),
		title: 'Webpack',
	},
	{
		publicId: GetFeatureLogoId('redis'),
		title: 'Redis',
	},
	{
		publicId: GetFeatureLogoId('vscode'),
		title: 'VScode',
	},
	{
		publicId: GetFeatureLogoId('webstorm'),
		title: 'Webstorm',
	},
]
