module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:import/errors',
		// 'plugin:import/warnings',
		// 'plugin:import/typescript',
		// 'plugin:promise/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module',
	},
	plugins: ['prettier', '@typescript-eslint'],
	rules: {
		'no-var': ['error'],
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
				singleQuote: true,
				semi: false,
				printWidth: 80,
				tabWidth: 4,
				useTabs: true,
			},
		],
	},
	env: {
		// change as necessary
		node: true,
	},
}
