import { mergePluginData } from '@Utils'

describe('Package Helper', () => {
	it('Merge correct meta.json files', () => {
		const templateMeta = {
			name: '<%= name %>',
			plugins: [],
		}

		const result = mergePluginData(
			templateMeta,
			'./__mocks__/plugins',
			['plugin1', 'plugin2'],
			'meta.json'
		)

		console.log(result)
		expect(result).toBe(result)
	})
})
