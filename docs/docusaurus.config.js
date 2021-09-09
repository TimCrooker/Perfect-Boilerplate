const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
	title: 'Botsea',
	tagline: 'The ultimate boilerplate solution',
	url: 'https://botseaio.github.io',
	baseUrl: '/Perfect-Boilerplate/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon:
		'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/botsea/branding/logo/icon',
	organizationName: 'botseaio', // Usually your GitHub org/user name.
	projectName: 'Perfect-Boilerplate', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: 'Botsea',
			logo: {
				alt: 'My Site Logo',
				src: 'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/botsea/branding/logo/icon',
			},
			items: [
				{
					type: 'doc',
					docId: 'intro',
					position: 'left',
					label: 'Docs',
				},
				{ to: '/blog', label: 'Blog', position: 'left' },
				{
					href: 'https://github.com/BotSeaio/Perfect-Boilerplate',
					label: 'GitHub',
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
							href: 'https://github.com/facebook/docusaurus',
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
						'https://github.com/facebook/docusaurus/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl:
						'https://github.com/facebook/docusaurus/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
}
