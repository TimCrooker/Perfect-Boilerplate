import { access, readdir } from 'fs'
import path from 'path'
import { promisify } from 'util'

export const FSHelper = {
	PathExists: async (path: string): Promise<boolean> => {
		try {
			await promisify(access)(path)
			return true
		} catch (e) {
			return false
		}
	},

	ReadDir: async (path: string): Promise<string[]> => {
		try {
			return await promisify(readdir)(path)
		} catch (e) {
			return []
		}
	},

	ValidPluginPack: async (basePath: string): Promise<boolean> => {
		// check that path exists
		const validPath = await FSHelper.PathExists(path.resolve(basePath))
		if (!validPath) return false

		// check for plugin.js file
		const hasPromptFile = await FSHelper.PathExists(
			path.resolve(basePath, 'prompt.js')
		)
		if (!hasPromptFile) return false

		// check for template dir
		const hasTemplateDir = await FSHelper.PathExists(
			path.resolve(basePath, 'template')
		)
		if (!hasTemplateDir) return false

		// check for plugins dir
		// const hasPluginsDir = await FSHelper.PathExists(path + '/plugins')
		// if (!hasPluginsDir) return false

		return true
	},
}
