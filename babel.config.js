module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		'@babel/preset-typescript',
	],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./'],
				alias: {
					'@Utils': './src/Utils',
				},
			},
		],
	],
	ignore: ['**/__mocks__/*'],
}
