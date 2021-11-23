const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const path = require('path')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
	title: 'Botsea',
	tagline: 'The fastest way to build web applications',
	url: 'https://timcrooker.github.io',
	baseUrl: '/Perfect-Boilerplate/', // Usually `/` or `/my-project/`
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon:
		'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/botsea/branding/logo/icon',
	organizationName: 'TimCrooker', // Usually your GitHub org/user name.
	projectName: 'Perfect-Boilerplate', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: '',
			logo: {
				alt: 'My Site Logo',
				src: 'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/botsea/branding/logo/full',
			},
			style: 'dark',
			items: [
				{
					type: 'doc',
					docId: 'getting-started/introduction',
					position: 'right',
					label: 'Docs',
				},
				{
					label: 'GitHub',
					href: 'https://github.com/TimCrooker/Perfect-Boilerplate',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'More',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com/TimCrooker/Perfect-Boilerplate',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Botsea Inc.`,
		},
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl:
						'https://github.com/TimCrooker/Perfect-Boilerplate/edit/master/docs/',
				},
				theme: {
					customCss: [require.resolve('./src/css/custom.scss')],
				},
			},
		],
	],
	plugins: [
		'docusaurus-plugin-sass',
		[
			'docusaurus-plugin-module-alias',
			{
				alias: {
					'@': path.resolve(__dirname, './src/'),
				},
			},
		],
	],
}
