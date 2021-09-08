/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs'
import { FSHelper, logger } from '@Utils'
import chalk from 'chalk'
import { Stack } from '../../stack'

/**
 * watches supplied directories for changes and executes a function passing in the path to that file
 *
 * @param directories arrray of directory paths to watch for changes
 */
export const watchDirectories = async (
	directories: string[],
	watchSubdirectories = true,
	onChange?: (trueDir: string) => Promise<void>,
	context?: Stack
): Promise<void> => {
	for (const directory of directories) {
		// Get absolute system path
		const trueDir = path.resolve(directory)

		//Check path exists
		const checkDirPath = await FSHelper.PathExists(trueDir)
		if (!checkDirPath) {
			// logger.error(
			// 	`the directory ${chalk.cyan(directory)} does not exist`
			// )
			continue
		}

		// logger.info(`Watching for file changes on ${trueDir}`)

		let fsWait: any = false
		fs.watch(
			trueDir,
			{ recursive: watchSubdirectories },
			async (event, filename) => {
				if (filename && event === 'change') {
					if (fsWait) return
					fsWait = setTimeout(() => {
						fsWait = false
					}, 500)

					if (context) await context.rebuildProject()
					if (onChange) await onChange(trueDir)

					logger.info(
						'File:',
						chalk.yellow(filename),
						'at',
						chalk.cyan(trueDir),
						'Changed'
					)
				}
			}
		)
	}
}
