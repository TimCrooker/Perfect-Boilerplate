import { FSHelper, getChoicesFromDir, watchDirectories } from '@Utils'
import { logger, Logger } from '@Utils/logger'
import { Config as DevConfig } from './dev'
import path from 'path'
import { Options, SAO } from 'perfectsao'
import prompts from 'prompts'
import chalk from 'chalk'

export type StackType = 'fullstack' | 'frontend' | 'backend'

export interface Config extends DevConfig {
	stackType: StackType
	/** Absolute path to the stack directory (fullstack, frontend, backend) */
	sourcePath: string
}

export class Stack {
	logger: Logger
	config: Config
	sao: SAO | undefined

	stackPath: string
	sourcePath: string | undefined

	framework?: string

	constructor(config: Config, logger: Logger) {
		this.config = {
			...config,
		}

		this.stackPath = path.resolve(config.sourcePath, config.stackType)

		this.logger = logger
	}

	async runGenerator(): Promise<void> {
		if (this.sao === undefined) {
			this.logger.error(
				'You cannot run a stack until you run buildGenerator'
			)
			process.exit(1)
		}
		await this.sao.run().catch((err: Error) => {
			this.logger.log('We have encountered an error')
			this.logger.log()
			this.logger.error(err)
			process.exit(1)
		})

		if (this.config.develop) {
			await this.watchPlugins()
		}
	}

	/** Gets the final path to the working directory from the user and validates it */
	async getActualPluginPath(): Promise<void> {
		this.logger.info(
			'Checking if',
			chalk.cyan(this.stackPath),
			'is valid plugin pack'
		)

		if (!(await FSHelper.ValidPluginPack(this.stackPath))) {
			this.logger.info(
				chalk.yellow(this.config.stackType),
				'is not a plugin pack'
			)
			await this.getFramework()

			if (this.framework) {
				const newSource = path.resolve(this.stackPath, this.framework)
				if (await FSHelper.ValidPluginPack(newSource))
					this.sourcePath = newSource
			}
		}
		this.logger.info(
			chalk.yellow(this.framework),
			'framework found and is valid at',
			chalk.cyan(this.sourcePath)
		)
	}

	/** Ask user to choose a framework */
	private async getFramework(): Promise<void> {
		this.logger.info(
			'Looking for',
			chalk.yellow(this.config.stackType),
			'Frameworks'
		)
		const choices = await getChoicesFromDir(this.stackPath, true)

		const { answer } = await prompts({
			type: 'select',
			name: 'answer',
			message: 'Select your framework',
			choices: choices,
		})

		this.framework = answer
	}

	async watchPlugins(): Promise<void> {
		const pluginDirectories: string[] = this.sao?.data.selectedPlugins.map(
			(plugin: string) => {
				return path.resolve(
					this.sourcePath as string,
					'plugins',
					plugin
				)
			}
		)
		pluginDirectories.push(
			path.resolve(this.sourcePath as string, 'template')
		)
		await watchDirectories(pluginDirectories, true, undefined, this)
	}

	async rebuildPlugin(trueDir: string): Promise<void> {
		logger.info('Detected changes to', chalk.cyan(trueDir))

		if (this.sao) {
			this.sao.opts = {
				...this.sao.opts,
				answers: this.sao?.answers,
			}
			await this.sao?.run()
		}
	}

	/** Builds the generator for the stack  */
	async buildGenerator(): Promise<void> {
		logger.info(
			'Building',
			chalk.yellow(this.config.stackType),
			'generator'
		)
		await this.getActualPluginPath()

		this.sao = new SAO({
			generator: this.config.generator,
			outDir: this.config.projectDir,
			logLevel: this.config.logLevel,
			appName: this.config.projectDir,
			extras: {
				stack: this as Stack,
				debug: true,
			},
		} as Options)
	}
}
