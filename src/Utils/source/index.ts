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
import { DEFAULT } from '../../config'

/** takes CLI source input for custom plugins source and returns the path to the directory */
export const getSource: GetSourceFn = async (source) => {
	const sourceSpinner = ora(
		`Checking provided source ${chalk.bold`"${source}"`}`
	)
	sourceSpinner.start()

	/** Replace path if default */
	const sourcePath = source ?? DEFAULT.PLUGIN_SOURCE

	/** Check if source is a local path */
	const PathExists = await FSHelper.PathExists(sourcePath)

	if (PathExists) {
		sourceSpinner.succeed('Found local source.')
		return { path: sourcePath }
	} else {
		/** Check repo exists */
		sourceSpinner.text = 'Checking remote source...'
		const repoStatus = await GitHelper.RepoExists(sourcePath)
		/** Clone repo and get path */
		if (repoStatus.exists === true) {
			sourceSpinner.text = 'Remote source found. Cloning...'
			const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath)
			if (cloneResponse) {
				sourceSpinner.succeed('Cloned remote source successfully.')
				return { path: cloneResponse }
			}
			sourceSpinner.fail('Could not retrieve source repository.')
			return { error: 'Could not retrieve source repository.' }
		} else {
			sourceSpinner.fail('Could not found source repository.')
			return { error: repoStatus.error }
		}
	}
}
