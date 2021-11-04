import path from 'path'
import {
	containsValidPluginPacks,
	getValidPluginPacks,
	isValidPluginPack,
} from '.'

describe('Plugins', () => {
	const basePath = path.resolve(__dirname)

	const MockRootDir = path.resolve(basePath, 'fixtures')

	it('correctly formatted plugin pack', async () => {
		const ValidPack = await isValidPluginPack(MockRootDir)

		expect(ValidPack).toBeTruthy()
	})

	it('incorrectly formatted plugin pack', async () => {
		const ValidPack = await isValidPluginPack('.')

		expect(ValidPack).toBeFalsy()
	})

	it('directory contains valid plugin packs', async () => {
		const validPacks = await containsValidPluginPacks(basePath)

		console.log(basePath)

		expect(validPacks).toBeTruthy()
	})

	it('gets valid plugin packs', async () => {
		const validPacks = await getValidPluginPacks(basePath)
		console.log(validPacks)
		expect(validPacks).toStrictEqual(['fixtures'])
	})
})
