/* eslint-disable @typescript-eslint/no-explicit-any */
import { getChoicesFromDir, getSource, logger, spinner } from '@Utils'
import chalk from 'chalk'
import path from 'path'
import prompts from 'prompts'
import { Stack, StackType } from './stack'
import { PackageJson } from 'type-fest'
import {
	DEBUG,
	DEV,
	LogLevel,
	logLevelFromMode,
	LogMode,
	RUN,
} from '@Utils/logger'
import figlet from 'figlet'

export interface Config {
	/** Path to the saofile generator */
	generator: string
	/** Name of directory being built to */
	projectDir: string
	/** Path of the project Directory to output to */
	projectPath?: string
	/** Path to the main dir for all source files */
	sourceDir?: string
	/** Enable debug level logging and disable npm install */
	debug?: boolean
	/** Enable hot plugin reloading for live testing */
	develop?: boolean
	/** Package.json file of the perfect-boilerplate engine for meta data */
	engineData: PackageJson
	/** level of console logging to diplay to the user */
	logLevel?: LogLevel
}

export class Dev {
	config: Config
	logger = logger
	spinner = spinner
	projectType: string | undefined
	stackType: StackType | undefined
	stack: Stack | undefined

	sourcePath: string | undefined

	constructor(config: Config) {
		this.config = {
			...config,
			projectPath: path.resolve(config.projectDir || '.'),
		}
		;(this.config.logLevel = logLevelFromMode(this.mode) || 3),
			logger.setOptions({
				logLevel: this.config.logLevel,
			})

		logger.info(`Running in ${this.mode} mode!`)

		logger.log(
			this.config.engineData.name,
			this.config.engineData.version,
			this.config.engineData.description
		)

		if (!config.projectDir) {
			logger.warn(
				'You have not supplied a project directory. The project will be built in your current directory'
			)
		}
	}

	/** Get the absolute plugin packs source directory */
	async getSourceDir(): Promise<void> {
		logger.info('Loading and validating source path')

		const sourcePath = this.config.sourceDir
		const { path, error } = await getSource(this.config.sourceDir)

		if (error) {
			logger.error(error)
			logger.info('Source can be a remote git repository or a local path')
			logger.log('You provided: ', chalk.blueBright(sourcePath))
			process.exit(1)
		}

		if (path) this.sourcePath = path
	}

	async runCLI(): Promise<void> {
		console.clear()

		figlet(
			this.config.engineData.name?.toUpperCase() as string,
			{ horizontalLayout: 'fitted' },
			function (err, data) {
				if (err) {
					console.log('Something went wrong...')
					console.dir(err)
					return
				}
				console.log(data)
			}
		)

		await this.getSourceDir()

		await this.getProjectType()

		if (this.projectType === 'Custom') {
			await this.getStackType()
			await this.createStack()
			await this.stack?.buildGenerator()
		}

		this.stack?.runGenerator()
	}

	/** User selects project type to build */
	async getProjectType(): Promise<void> {
		const source = this.sourcePath as string

		logger.info('looking for project types in', chalk.cyan(source))
		const choices = [
			{ title: 'Custom', value: 'Custom' },
			...(await getChoicesFromDir(source, true)),
		]

		const { projectType } = await prompts({
			type: 'select',
			name: 'projectType',
			message: 'Select your project type',
			choices: choices,
		})

		this.projectType = projectType

		this.sourcePath = path.resolve(source, projectType)
	}

	async getStackType(): Promise<void> {
		const source = this.sourcePath as string

		if (this.stackType === undefined && this.projectType === 'Custom') {
			logger.info('looking for stack types in', chalk.cyan(source))
			const choices = await getChoicesFromDir(source)

			const { stackType } = await prompts({
				type: 'select',
				name: 'stackType',
				message: 'Select the scope of the stack',
				choices: choices,
			})

			this.stackType = stackType
		} else logger.error('Cannot access getStackType yet')
	}

	async runPluginHotReload(): Promise<void> {
		// run an sao generator that replaces the plugin files inside of the dev project
		// environment with the new, updated files from the plugin source being watched
	}

	async createStack(): Promise<void> {
		if (this.stackType === undefined) {
			logger.error(
				'trying to create new stack when stack type not selected'
			)
			process.exit(1)
		}

		const source = this.sourcePath as string

		this.stack = new Stack({
			...this.config,
			stackType: this.stackType,
			sourcePath: source,
		})
	}

	get mode(): LogMode {
		let mode: LogMode = RUN
		if (this.config.develop) mode = DEV
		if (this.config.debug) mode = DEBUG
		return mode
	}

	get pluginsPath(): string {
		return 'not implimented'
	}
}
