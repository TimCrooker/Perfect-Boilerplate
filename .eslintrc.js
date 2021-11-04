module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['prettier', '@typescript-eslint'],
	env: {
		// change as necessary
		node: true,
	},
	extends: [
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'no-var': ['error'],
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
				singleQuote: true,
				semi: false,
				printWidth: 80,
				tabWidth: 2,
				useTabs: true,
			},
		],
	},
}
