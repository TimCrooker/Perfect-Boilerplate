import { mergePluginData } from '@Utils'

describe('Package Helper', () => {
	it('Merge correct meta.json files', () => {
		const templateMeta = {
			name: '<%= name %>',
			plugins: [],
		}

		const result = mergePluginData(
			templateMeta,
			'./fixtures/plugins',
			['plugin1', 'plugin2'],
			'meta.json'
		)
		expect(result).toBe(result)
	})
})
