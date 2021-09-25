import path from 'path'
import validate from 'validate-npm-package-name'

import {
	BinaryHelper,
	concatExtend,
	extendBase,
	FSHelper,
	getPluginsArray,
	handleIgnore,
	mergeBabel,
	mergeJSONFiles,
	mergePackages,
	mergePluginData,
} from '@Utils'
import { Action, GeneratorConfig } from '../@types/sao'
import { Stack } from './stack'

const saoConfig: GeneratorConfig = {
	/**
	 * Returns an array of prompts to display to the user
	 */
	prompts(sao) {
		const stack = sao.opts.extras.stack as Stack

		const sourcePath = stack.sourcePath

		const appName = stack.config.projectDir

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const sourcePrompts = FSHelper.requireUncached(
			path.resolve(sourcePath, 'prompt.js')
		)

		return [
			{
				type: 'input',
				name: 'name',
				message: 'What will be the name of your app',
				default: appName,
			},
			...(BinaryHelper.CanUseYarn()
				? [
						{
							name: 'pm',
							message: 'Package manager:',
							choices: [
								{ message: 'Npm', value: 'npm' },
								{ message: 'Yarn', value: 'yarn' },
							],
							type: 'select',
							default: 'npm',
						},
				  ]
				: []),
			// presents the prompts from the selected plugin pack to the user
			...(sourcePrompts?.prompts ?? []),
		]
	},

	/**
	 * Runs after recieving answers from the user to all presented prompts
	 *
	 * This function is used for manipulating data before it gets passed to the actions function
	 *
	 * all functions that are run after this one will have access to "sao.data" which will contain all of this function's returns
	 */
	data(sao) {
		const stack = sao.opts.extras.stack as Stack

		/**
		 * Package Manager
		 */
		sao.answers.pm = BinaryHelper.CanUseYarn() ? stack.pm : 'npm'

		const pmRun = stack.pmRun

		/**
		 * Extend.js data
		 */
		const sourcePath = stack.sourcePath

		const pluginAnswers = { ...sao.answers }
		delete pluginAnswers.name

		const selectedPlugins = getPluginsArray(pluginAnswers)

		const extendData = concatExtend(
			extendBase,
			selectedPlugins,
			sourcePath,
			sao.answers
		)

		const metaJSONPath = 'src/meta.json'

		/**
		 * Plugins meta data
		 */
		const pluginsData = mergePluginData(
			{},
			sourcePath,
			selectedPlugins,
			'meta.json'
		).plugins

		/**
		 * Return
		 */
		return {
			...sao.answers,
			metaJSONPath,
			answers: sao.answers,
			selectedPlugins,
			pmRun,
			pluginsData,
			...extendData,
		}
	},

	/**
	 * Runs after manipulating data in the data function and gets passed that manipulated data
	 *
	 * Execute file and directory transformation actions
	 *
	 * actions are objects containing a set of instructions on a single transformation pattern
	 *
	 * ADD: Adds files to the destination path from the source path
	 *
	 * MOVE: Runs fs.rename or fs.copyFile to move a file from source path to destination path
	 *
	 * MODIFY: Modifies the contents of a file
	 *
	 * REMOVE: Deletes a file
	 *
	 * @returns array of action objects
	 */
	async actions(sao) {
		const stack = sao.opts.extras.stack as Stack

		if (sao.answers.name.length === 0) {
			const error = sao.createError('App name is required!')
			throw error
		}

		/**
		 * Validate app name
		 */
		const appNameValidation = validate(sao.answers.name)

		if (appNameValidation.warnings) {
			appNameValidation.warnings.forEach((warn) => this.logger.warn(warn))
		}

		if (appNameValidation.errors) {
			appNameValidation.errors.forEach((warn) => this.logger.error(warn))
			process.exit(1)
		}

		const sourcePath = stack.sourcePath as string

		const actionsArray = [
			{
				type: 'add',
				files: '**',
				templateDir: path.join(sourcePath, 'template'),
				data() {
					return sao.data
				},
			},
			{
				type: 'move',
				templateDir: path.join(sourcePath, 'template'),
				patterns: {
					gitignore: '.gitignore',
					'_package.json': 'package.json',
					'_next-env.d.ts': 'next-env.d.ts',
					'_tsconfig.json': 'tsconfig.json',
					babelrc: '.babelrc',
				},
				data() {
					return sao.data
				},
			},
		] as Action[]

		const pluginAnswers = { ...sao.answers }
		delete pluginAnswers.name

		const selectedPlugins = getPluginsArray(pluginAnswers)

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const sourcePrompts = FSHelper.requireUncached(
			path.resolve(sourcePath, 'prompt.js')
		)

		/**
		 *
		 */
		actionsArray.push(
			...selectedPlugins.map((plugin: string) => {
				const customFilters = handleIgnore(
					sourcePrompts?.ignores ?? [],
					sao.answers,
					plugin
				)

				return {
					type: 'add' as const,
					files: '**',
					templateDir: path.join(sourcePath, 'plugins', plugin),
					filters: {
						'extend.js': false,
						'package.json': false,
						'package.js': false,
						'tsconfig.json': false,
						'.babelrc': false,
						'meta.json': false,
						...customFilters,
					},
					data() {
						return sao.data
					},
				}
			})
		)

		/**
		 * eslintrc handler
		 */
		actionsArray.push({
			type: 'move' as const,
			patterns: {
				'_.eslintrc': '.eslintrc',
				'_.eslintrc.js': '.eslintrc.js',
			},
			data() {
				return sao.data
			},
		} as Action)

		/**
		 * meta.json handler
		 */
		actionsArray.push({
			type: 'modify' as const,
			files: sao.data.metaJSONPath,
			handler(data: Record<string, unknown>) {
				return mergePluginData(data, sourcePath, selectedPlugins, 'meta.json')
			},
		})

		/**
		 * package.json handler
		 */
		actionsArray.push({
			type: 'modify' as const,
			files: 'package.json',
			handler(data: Record<string, unknown>) {
				return mergePackages(data, sourcePath, selectedPlugins, sao.answers)
			},
		})

		/**
		 * tsconfig.json handler
		 */
		actionsArray.push({
			type: 'modify' as const,
			files: 'tsconfig.json',
			handler(data: Record<string, unknown>) {
				return mergeJSONFiles(
					data,
					sourcePath,
					selectedPlugins,
					'tsconfig.json',
					{
						arrayMerge: (dest: unknown[], source: unknown[]) => {
							const arr = [...dest, ...source]
							return arr.filter((el, i) => arr.indexOf(el) === i)
						},
					}
				)
			},
		})

		/**
		 * .babelrc handler
		 */
		actionsArray.push({
			type: 'modify' as const,
			files: '.babelrc',
			async handler(data: string) {
				const merged = await mergeBabel(
					JSON.parse(data),
					sourcePath,
					selectedPlugins
				)
				return JSON.stringify(merged)
			},
		})

		return actionsArray
	},

	/**
	 * Runs before actions are executed
	 */
	async prepare(sao) {
		const stack = sao.opts.extras.stack as Stack

		await stack.prepare()
	},

	/**
	 * Runs after actions are done being executed
	 */
	async completed(sao) {
		const stack = sao.opts.extras.stack as Stack

		await stack.completed()
	},
}

module.exports = saoConfig
