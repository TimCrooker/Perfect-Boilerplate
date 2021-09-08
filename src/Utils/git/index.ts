import { promisify } from 'util'
import { exec } from 'child_process'
import { mkdir } from 'temp'

import { UrlHelper } from '@Utils'

export const GitHelper = {
	RepoExists: async (
		path: string
	): Promise<{ exists: boolean; error?: string }> => {
		if (UrlHelper.IsUrl(path)) {
			try {
				await promisify(exec)(
					`git ls-remote ${UrlHelper.GetGitUrl(path)}`
				)
				return { exists: true }
			} catch (e) {
				return { exists: false, error: 'Source repository not found.' }
			}
		}
		return { exists: false, error: 'Source path not valid' }
	},
	CloneAndGetPath: async (path: string): Promise<string> => {
		try {
			const tempInfo = await promisify(mkdir)('')
			await promisify(exec)(
				`git clone --depth 1 ${UrlHelper.GetGitUrl(path)} "${tempInfo}"`
			)
			return tempInfo as string
		} catch (e) {
			throw Error(e)
		}
	},
}
