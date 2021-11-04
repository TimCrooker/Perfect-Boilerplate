import { logger, watchDirectories } from '@Utils'
import path from 'path'
import chalk from 'chalk'
import EventEmitter from 'events'
import { Grit } from 'grit-cli'

interface Extras {
	appName: string
	stack: Stack
}

export interface StackConfig {
	/** Path to the saofile generator */
	generator: string
	/** Name of directory being built to */
	projectDir: string
	/** Absolute path to the plugin pack source directory */
	sourcePath: string
	/** log level passed down through to generator */
	logLevel: 1 | 2 | 3 | 4
	/** Enable debug level logging and disable npm install */
	debug: boolean
	/** Enable hot plugin reloading for live testing */
	develop: boolean
}

export class Stack {
	config: StackConfig
	/** Generator instance that runs the stack build */
	grit!: Grit
	/** Absolute path to the plugin pack source directory */
	sourcePath: string

	constructor(config: StackConfig) {
		this.config = {
			...config,
		}

		this.sourcePath = path.resolve(config.sourcePath)
	}

	/** Run the current generator */
	async run(): Promise<void> {
		await this.build()

		await this.grit.run().catch((err: Error) => {
			logger.log('We have encountered an error')
			logger.log()
			logger.error(err)
			process.exit(1)
		})

		!this.debug && (await this.installPackages())

		!this.debug && this.runProjectScript('dev')

		this.develop && (await this.watchPlugins())
	}

	/** Builds the generator for the stack  */
	private async build(): Promise<void> {
		logger.info('Building generator')

		this.grit = new Grit({
			generator: this.config.generator,
			outDir: this.config.projectDir,
			logLevel: this.config.logLevel,
			// answers: { features: ['env'] },
			extras: {
				stack: this as Stack,
				appName: this.config.projectDir,
			},
		} as Options<Extras>)
	}

	/**
	 * Hot Reloading
	 */

	/** Watch plugin directories for changes */
	private async watchPlugins(): Promise<void> {
		logger.info(
			'Watching files in ',
			chalk.cyan(this.sourcePath),
			' for changes'
		)

		const pluginDirectories = this.selectedPluginsPaths

		// add the template directory to the list
		pluginDirectories.push(path.resolve(this.sourcePath, 'template'))
		// add the prompt.js file to the list
		// pluginDirectories.push(path.resolve(this.sourcePath, 'prompt.js'))
		const event = new EventEmitter()

		// event triggered by file changes in plugins
		event.on('Rebuild', async (pluginPath, filename) => {
			await this.rebuildProject(path.basename(pluginPath), filename).catch(
				(err: Error) => {
					logger.error('Rebuild encountered the following error', err)
					// process.exit(1)
				}
			)

			logger.info('Watching for changes')
		})

		// begin watching plugin pack directories for changes
		await watchDirectories(pluginDirectories, true, event)
	}
	/** Rebuild project */
	async rebuildProject(pluginName: string, filename: string): Promise<void> {
		logger.info(
			'Changes detected in',
			chalk.cyan(pluginName),
			'plugin, now rebuilding'
		)
		// update generator options with previous run's answers
		this.grit.opts = {
			...this.grit.opts,
			answers: { ...this.grit.answers },
		}

		// run rebuild in quiet mode
		this.grit.logger.options.logLevel = 1

		// run the rebuild
		await this.grit.run()

		!this.debug &&
			['package.json', '_package.json'].includes(filename) &&
			(await this.installPackages())
	}

	/**
	 * Getters / Setters
	 */
}
