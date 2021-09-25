import { access, lstat, lstatSync, readdir } from 'fs'
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

	IsFile: async (path: string): Promise<boolean> => {
		try {
			return (await promisify(lstat)(path)).isFile()
		} catch (e) {
			return false
		}
	},

	IsDirectory: async (path: string): Promise<boolean> => {
		try {
			return (await promisify(lstat)(path)).isDirectory()
		} catch (e) {
			return false
		}
	},
	IsFileSync: (path: string): boolean => {
		try {
			return lstatSync(path).isFile()
		} catch (e) {
			return false
		}
	},

	IsDirectorySync: (path: string): boolean => {
		try {
			return lstatSync(path).isDirectory()
		} catch (e) {
			return false
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	requireUncached: (module: any): any => {
		delete require.cache[require.resolve(module)]
		return require(module)
	},
}
