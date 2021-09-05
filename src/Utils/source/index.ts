/**
 *
 * get_source will return path for plugins
 * source can be url - relative local path or "superplate"
 *
 */
import ora from 'ora'
import chalk from 'chalk'

import { GitHelper, FSHelper } from '@Utils'
import { GetSourceFn } from './source'
import path from 'path'

/**
 * takes CLI source input for custom plugins source and returns the path to the directory
 */
export const getSource: GetSourceFn = async (source) => {
	/**
	 * Replace path if default
	 */
	const sourceSpinner = ora(
		`Checking provided source ${chalk.bold`"${source}"`}`
	)
	sourceSpinner.start()

	const sourcePath =
		source ?? 'https://github.com/BotSeaio/Perfect-Boilerplate-Plugins.git'

	const PathExists = await FSHelper.PathExists(sourcePath)
	if (PathExists) {
		/**
		 * check local path
		 */

		sourceSpinner.succeed('Found local source.')
		return { path: path.resolve(sourcePath) }
	} else {
		/**
		 * Check repo exists
		 * clone and return path if exists
		 */
		sourceSpinner.text = 'Checking remote source...'
		const repoStatus = await GitHelper.RepoExists(sourcePath)
		if (repoStatus.exists === true) {
			sourceSpinner.text = 'Remote source found. Cloning...'
			const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath)
			if (cloneResponse) {
				sourceSpinner.succeed('Cloned remote source successfully.')
				return { path: cloneResponse + '/src' }
			}
			sourceSpinner.fail('Could not retrieve source repository.')
			return { error: 'Could not retrieve source repository.' }
		} else {
			sourceSpinner.fail('Could not found source repository.')
			return { error: repoStatus.error }
		}
	}
}
