import { FSHelper, getChoicesFromDir, tips, watchDirectories } from '@Utils'
import { logger } from '@Utils/logger'
import { Config as DevConfig } from './dev'
import path from 'path'
import { Options, SAO } from 'perfectsao'
import prompts from 'prompts'
import chalk from 'chalk'
import { promisify } from 'util'
import { exec } from 'child_process'
import ora from 'ora'

export type StackType = 'fullstack' | 'frontend' | 'backend'

export interface Config extends DevConfig {
	/** Type of stack being built (fullstack, frontend, backend) */
	stackType: StackType
	/** Absolute path to the project type directory */
	sourcePath: string
}

export class Stack {
	config: Config
	/** Generator instance that runs the stack build */
	sao: SAO | undefined

	/** Absolute path to the stack Directory */
	sourcePath: string

	framework?: string

	constructor(config: Config) {
		this.config = {
			...config,
		}

		this.sourcePath = path.resolve(config.sourcePath, config.stackType)
	}

	async runGenerator(): Promise<void> {
		if (this.sao === undefined) {
			logger.error('You cannot run a stack until you run buildGenerator')
			process.exit(1)
		}
		await this.sao.run().catch((err: Error) => {
			logger.log('We have encountered an error')
			logger.log()
			logger.error(err)
			process.exit(1)
		})

		// await this.installPackages()

		// this.runProjectScript('dev')

		if (this.config.develop) {
			await this.watchPlugins()
		}
	}

	/** Gets the final path to the working directory from the user and validates it */
	private async getActualSourcePath(): Promise<void> {
		logger.info(
			'Checking if',
			chalk.cyan(this.sourcePath),
			'is plugin pack'
		)

		if (!(await FSHelper.ValidPluginPack(this.sourcePath))) {
			logger.info(
				chalk.yellow(this.config.stackType),
				'is not a plugin pack...'
			)

			await this.getFramework()

			if (this.framework) {
				this.sourcePath = path.resolve(this.sourcePath, this.framework)
			}
			logger.info(
				chalk.yellow(this.framework),
				'framework found and is valid at',
				chalk.cyan(this.sourcePath)
			)
		}
	}

	/** Ask user to choose a framework */
	private async getFramework(): Promise<void> {
		logger.info(
			'Looking for',
			chalk.yellow(this.config.stackType),
			'Frameworks'
		)
		const choices = await getChoicesFromDir(this.sourcePath, true)

		const { answer } = await prompts({
			type: 'select',
			name: 'answer',
			message: 'Select your framework',
			choices: choices,
		})

		this.framework = answer
	}

	async gitInit(): Promise<void> {
		if (this.sao) {
			this.sao.gitInit()
		}
	}

	async installPackages(): Promise<void> {
		if (this.sao) {
			await this.sao.npmInstall({
				npmClient: this.sao.answers.pm,
				// installArgs: ['--silent'],
			})
		}
	}

	postInstallTips(): void {
		if (this.sao) {
			tips.postInstall({
				name: this.sao.opts.appName ?? '',
				dir: this.sao.outDir,
				pm: this.sao.answers.pm,
			})
		}
	}

	async runProjectScript(scriptName: string): Promise<void> {
		logger.info('Running project build in dev mode')

		await promisify(exec)(
			`npm --prefix ${this.sao?.outDir} run ${scriptName}`
		)
	}

	/** Watch for changes in the project source and trigger rebuilds when files change */
	private async watchPlugins(): Promise<void> {
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

	/** Performs test project plugin rebuild when in DEV mode */
	async rebuildProject(trueDir: string): Promise<void> {
		logger.info('Detected changes to file', chalk.cyan(trueDir))
		if (this.sao) {
			logger.info('Rebuilding Project')
			this.sao.opts = {
				...this.sao.opts,
				answers: this.sao?.answers,
			}
			this.sao.logger.options.logLevel = 1
			await this.sao?.run()
			logger.info('Watching for changes...')
		}
	}

	/** Builds the generator for the stack  */
	async buildGenerator(): Promise<void> {
		logger.info(
			'Building',
			chalk.yellow(this.config.stackType),
			'generator'
		)

		await this.getActualSourcePath()

		this.sao = new SAO({
			generator: this.config.generator,
			outDir: this.config.projectDir,
			appName: this.config.projectDir,
			logLevel: 1,
			extras: {
				stack: this as Stack,
				debug: this.config.debug,
			},
		} as Options)
	}
}
