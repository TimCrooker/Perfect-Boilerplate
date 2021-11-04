/* eslint-disable @typescript-eslint/no-explicit-any */
import { FSHelper, getChoicesFromDir, getSource, logger, spinner } from '@Utils'
import chalk from 'chalk'
import path from 'path'
import prompts from 'prompts'
import { StackConfig } from './stack'
import { PackageJson } from 'type-fest'
import { logLevelFromMode } from '@Utils/logger'
import figlet from 'figlet'
import { LogLevel } from '@Utils/logger/logger'
import { containsValidPluginPacks, isValidPluginPack } from '@Utils/plugin'

export interface Config {
	/** generator string */
	generator: string
	/** Name of directory being built to */
	projectDir: string
	/** Path to the main dir for all source files */
	sourceDir?: string
	/** Enable debug level logging and disable npm install */
	debug?: boolean
	/** Enable hot plugin reloading for live testing */
	develop?: boolean
	/** Package.json file of the perfect-boilerplate engine for meta data */
	enginePackage: PackageJson
	/** level of console logging to diplay to the user */
	logLevel?: LogLevel
}

export class PerfectPlate {
	config: Config
	logger = logger
	spinner = spinner

	/** Absolute path to project output directory */
	outDirPath: string
	/** Absolute path to plugin pack source directory */
	sourcePath!: string

	// projectType: string | undefined
	// stackType: StackType | undefined
	// stack: Stack | undefined

	constructor(config: Config) {
		this.config = {
			...config,
		}

		this.outDirPath = path.resolve(config.projectDir || '.')

		this.logger.setOptions({
			logLevel: logLevelFromMode(
				config.develop || false,
				config.debug || false
			),
		})

		logger.log(
			this.config.enginePackage.name,
			this.config.enginePackage.version,
			this.config.enginePackage.description
		)

		if (!config.projectDir) {
			logger.warn(
				'You have not supplied a project directory. The project will be built in your current directory'
			)
		}
	}

	async run(): Promise<void> {
		this.displayTitle()

		// Find and validate the actual source directory
		await this.getSourcePath()

		// Search for plugin packs
		await this.findPluginPacks()

		logger.info(this.sourcePath)
	}

	private displayTitle(): void {
		console.clear()
		console.log(
			figlet.textSync(this.config.enginePackage.name?.toUpperCase() as string, {
				horizontalLayout: 'fitted',
			})
		)
	}

	/** Get source directory path */
	private async getSourcePath(): Promise<void> {
		logger.info('Loading and validating source path')

		const sourcePath = this.config.sourceDir

		const { path, error } = await getSource(sourcePath)
		if (error || !path) {
			logger.error(error)
			logger.info('Source can be a remote git repository or a local path')
			logger.log('You provided: ', chalk.blueBright(sourcePath))
			process.exit(1)
		}

		this.sourcePath = path
	}

	private async findPluginPacks(): Promise<void> {
		logger.debug('starting plugin pack search')

		try {
			this.sourcePath = await this.recursivePrompting(this.sourcePath)
		} catch (e) {
			logger.debug('Base directory contains no plugin packs')
			try {
				const srcDirPath = path.resolve(this.sourcePath, 'src')
				this.sourcePath = await this.recursivePrompting(srcDirPath)
			} catch (e) {
				logger.error('you are fucked')
				process.exit(1)
			}
		}
	}

	private async recursivePrompting(sourcePath: string): Promise<string> {
		const source = path.resolve(sourcePath)

		if (await isValidPluginPack(source)) {
			// we are done and have final directory
			logger.debug('base directory is a plugin pack')
			return sourcePath
		}
		const choicePath = path.resolve(source, 'choice.js')

		if (await FSHelper.PathExists(choicePath)) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { choice } = require(choicePath)

			// prompt user to select one
			let choices = await getChoicesFromDir(source)

			if (choice.ignores) {
				choices = choices.filter((item) => {
					return !choice.ignores.includes(item.title)
				})
			}

			const { answer } = await prompts({
				type: 'select',
				name: 'answer',
				message: choice.title || 'Select one',
				choices: choices,
			})

			return await this.recursivePrompting(path.resolve(source, answer))
		}
		if (await containsValidPluginPacks(source)) {
			// prompt user to select one
			logger.debug(
				'base directory contains plugin packs now prompting user to select one'
			)
			const choices = await getChoicesFromDir(source, true)

			const { answer } = await prompts({
				type: 'select',
				name: 'answer',
				message: 'Select one',
				choices: choices,
			})
			return path.resolve(source, answer)
		}

		throw new Error()
	}

	get stackConfig(): StackConfig {
		return {
			generator: this.config.generator,
			projectDir: this.config.projectDir,
			sourcePath: this.sourcePath,
			logLevel: logger.options.logLevel,
			debug: this.config.debug || false,
			develop: this.config.develop || false,
		}
	}
}
