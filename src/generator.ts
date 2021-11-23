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
import { Action, GeneratorConfig } from 'grit-cli'

const generatorConfig: GeneratorConfig = {
	prompts() {
		const sourcePath = this.sourcePath

		const sourcePrompts =
			FSHelper.requireUncached(path.resolve(sourcePath, 'prompt.js')) || {}

		return [teAction.add({
				files: '**',
				templateDir: path.join(sourcePath, 'template'),
			}),
			this.createPrompt.input({
				name: 'name',
				message: 'What will be the name of your app',
				default: () => this.outDir,
				validate: (name) => {
					const { validForNewPackages } = validate(name)

					return validForNewPackages ? true : 'Invalid name'
				},
			}),
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
			...(sourcePrompts.prompts ?? []),
		]
	},

	data() {
		/**
		 * Extend.js data
		 */
		const sourcePath = stack.sourcePath

		const pluginAnswers = { ...this.answers }
		delete pluginAnswers.name

		const selectedPlugins = getPluginsArray(pluginAnswers)

		const extendData = concatExtend(
			extendBase,
			selectedPlugins,
			sourcePath,
			this.answers
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
			...this.answers,
			metaJSONPath,
			answers: this.answers,
			selectedPlugins,
			pluginsData,
			...extendData,
		}
	},

	async actions() {
		const sourcePath = 'fake/path'

		const actionsArray: Action[] = [
			this.crea
			this.createAction.move({
				patterns: {
					gitignore: '.gitignore',
					'_package.json': 'package.json',
					'_next-env.d.ts': 'next-env.d.ts',
					'_tsconfig.json': 'tsconfig.json',
					babelrc: '.babelrc',
				},
			}),
		]

		const pluginAnswers = { ...this.answers }
		delete pluginAnswers.name

		const selectedPlugins = getPluginsArray(pluginAnswers)

		const sourcePrompts = FSHelper.requireUncached(
			path.resolve(sourcePath, 'prompt.js')
		)

		actionsArray.push(
			...selectedPlugins.map((plugin: string) => {
				const customFilters = handleIgnore(
					sourcePrompts?.ignores ?? [],
					this.answers,
					plugin
				)

				return this.createAction.add({
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
				})
			})
		)

		/**
		 * eslintrc handler
		 */
		actionsArray.push(
			this.createAction.move({
				patterns: {
					'_.eslintrc': '.eslintrc',
					'_.eslintrc.js': '.eslintrc.js',
				},
			})
		)

		/**
		 * meta.json handler
		 */
		actionsArray.push(
			this.createAction.modify({
				files: this.data.metaJSONPath,
				handler(data: Record<string, unknown>) {
					return mergePluginData(data, sourcePath, selectedPlugins, 'meta.json')
				},
			})
		)

		/**
		 * package.json handler
		 */
		actionsArray.push(
			this.createAction.modify({
				files: 'package.json',
				handler: (fileData: Record<string, unknown>) => {
					return mergePackages(
						fileData,
						sourcePath,
						selectedPlugins,
						this.answers
					)
				},
			})
		)

		/**
		 * tsconfig.json handler
		 */
		actionsArray.push(
			this.createAction.modify({
				files: 'tsconfig.json',
				handler: (data: Record<string, unknown>) => {
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
		)

		/**
		 * .babelrc handler
		 */
		actionsArray.push(
			this.createAction.modify({
				files: '.babelrc',
				handler: async (data: string) => {
					const merged = await mergeBabel(
						JSON.parse(data),
						sourcePath,
						selectedPlugins
					)
					return JSON.stringify(merged)
				},
			})
		)

		return actionsArray
	},
}

module.exports = generatorConfig
