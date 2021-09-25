import { logger, tips, watchDirectories } from '@Utils'
import path from 'path'
import chalk from 'chalk'
import { promisify } from 'util'
import { exec } from 'child_process'
import EventEmitter from 'events'
import { getPluginPath } from '@Utils/plugin'
import { Options, SAO } from 'perfectsao'

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
	sao!: SAO
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

		await this.sao.run().catch((err: Error) => {
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

		this.sao = new SAO({
			generator: this.config.generator,
			outDir: this.config.projectDir,
			appName: this.config.projectDir,
			logLevel: this.config.logLevel,
			// answers: { features: ['env'] },
			extras: {
				stack: this as Stack,
			},
		} as Options)
	}

	/**
	 * Git management
	 */

	/** Initializes Git repo for project */
	private async gitInit(): Promise<void> {
		if (this.sao) {
			this.sao.gitInit()
		}
	}
	/** Creates first git commit inside project git repo */
	private async gitCommit(): Promise<void> {
		if (this.sao) {
			try {
				// add
				await promisify(exec)(
					`git --git-dir="${this.sao.outDir}"/.git/ --work-tree="${this.sao.outDir}"/ add -A`
				)
				// commit
				await promisify(exec)(
					`git --git-dir="${this.sao.outDir}"/.git/ --work-tree="${this.sao.outDir}"/ commit -m "initial commit with perfect-boilerplate"`
				)
				logger.info('created an initial commit.')
			} catch (err) {
				logger.error('An error occured while creating git commit', err)
			}
		}
	}

	/**
	 *  Project Commands
	 */

	/** Install npm packages with selected package manager */
	private async installPackages(): Promise<void> {
		try {
			await this.sao.npmInstall({
				npmClient: this.sao.answers.pm,
				installArgs: ['--silent'],
			})
		} catch {
			logger.error('An error occured while installing dependencies')
		}
	}
	/** Run any script in the project's package.json */
	private async runProjectScript(scriptName: string): Promise<void> {
		logger.info('Running project build in dev mode')

		await promisify(exec)(`npm --prefix ${this.sao?.outDir} run ${scriptName}`)
	}

	/**
	 * Tips
	 */

	private preInstallTips(): void {
		tips.preInstall()
	}
	private postInstallTips(): void {
		tips.postInstall({
			name: this.sao.opts.appName ?? '',
			dir: this.sao.outDir,
			pm: this.sao.answers.pm,
		})
	}

	/**
	 * Generator Logic
	 */

	async data(): Promise<void> {
		logger.log('Not implimented')
	}
	async actions(): Promise<void> {
		logger.log('Not implimented')
	}
	async prepare(): Promise<void> {
		this.preInstallTips()
	}
	async completed(): Promise<void> {
		// !this.debug && !this.develop && (await this.gitInit())
		// !this.debug && (await this.installPackages())
		// !this.develop && this.postInstallTips()
		// run dev server for built project
		// !this.debug && !this.develop && this.runProjectScript('dev')
		// this.develop && (await this.watchPlugins())
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
		this.sao.opts = {
			...this.sao.opts,
			answers: { ...this.sao.answers },
		}

		// run rebuild in quiet mode
		this.sao.logger.options.logLevel = 1

		// run the rebuild
		await this.sao.run()

		!this.debug &&
			['package.json', '_package.json'].includes(filename) &&
			(await this.installPackages())
	}

	/**
	 * Getters / Setters
	 */

	get pmRun(): string | undefined {
		return this.sao.answers.pm === 'yarn' ? 'yarn' : 'npm run'
	}

	get pm(): string | undefined {
		return this.sao.answers.pm
	}

	get debug(): boolean {
		return this.config.debug
	}

	get develop(): boolean {
		return this.config.develop
	}

	get selectedPlugins(): string[] {
		return this.sao.data.selectedPlugins
	}

	get selectedPluginsPaths(): string[] {
		return this.selectedPlugins.map((pluginName: string) => {
			return getPluginPath(this.sourcePath, pluginName)
		})
	}
}
