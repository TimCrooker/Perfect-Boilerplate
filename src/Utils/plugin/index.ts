import { FSHelper, logger } from '@Utils'
import chalk from 'chalk'
import merge from 'deepmerge'
import path from 'path'
import { ExtendType, Answer, IgnoreHandlerFn, IgnoreType } from './plugin'

/**
 * Base file structure to extend
 */
export const extendBase: Required<ExtendType> = {
	_app: {
		import: [],
		inner: [],
		wrapper: [],
	},
	_document: {
		import: [],
		initialProps: [],
	},
}

/**
 * @summary Parse user answers for their desired plugins
 *
 * @param answers Dictionary of [key, value] pairs of answers all prompts
 *
 * @returns an array of selected plugins
 */
export const getPluginsArray: (answers: Record<string, Answer>) => string[] = (
	answers
) => {
	return Object.entries(answers)
		.reduce((acc: string[], [key, value]) => {
			if (typeof value === 'boolean' && value) return [...acc, key]
			if (typeof value === 'string') return [...(acc as string[]), value]
			if (Array.isArray(value)) return [...(acc as string[]), ...value]
			return acc
		}, [])
		.filter((value: string) => value !== 'none')
}

/**
 *
 * @param pluginPath path to a plugin pack
 * @param pluginName name of the plugin from the pack to target
 * @returns object containing extend function that itself returns the extend object to merge with the template files
 */
export const getExtend: (
	pluginPath: string,
	pluginName: string
) => { extend: (answers: Record<string, Answer>) => ExtendType } | undefined = (
	pluginPath,
	pluginName
) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pluginExtend = require(path.join(
			pluginPath,
			'plugins',
			pluginName,
			'extend.js'
		))

		return pluginExtend
	} catch (e) {
		return undefined
	}
}

/**
 *
 * @param base The base file structure that plugins can expand on
 * @param plugins Array of user-selected plugins to integrate
 * @param sourcePath Source directory of the selected plugin pack
 * @param answers [pluginName, answer] List of supplied user answers to all prompts
 * @returns the merged combination of the base file structure and the supplied extend.js file
 */
export const concatExtend: (
	base: ExtendType,
	plugins: string[],
	sourcePath: string,
	answers: Record<string, Answer>
) => ExtendType = (base, plugins, sourcePath, answers) => {
	// combines the extend.js file with the base file from the plugin pack template
	const merged = merge.all<ExtendType>([
		base,
		...plugins.map((plugin: string) => {
			const pluginExtendFile = getExtend(sourcePath, plugin)
			if (pluginExtendFile) {
				const pluginExtends = pluginExtendFile.extend(answers)
				return pluginExtends
			}
			return {}
		}),
	])

	return merged
}

/**
 *
 * @param ignores the array of ignore objects from the plugin packs prompt.js
 * @param answers answers provided by the user to all prompt questions
 * @param plugin name of the current plugin to target
 * @returns
 */
export const handleIgnore: IgnoreHandlerFn = (
	ignores: IgnoreType[],
	answers,
	plugin
) => {
	const filters: ReturnType<IgnoreHandlerFn> = {}

	ignores.forEach((ignore) => {
		if (
			!!ignore.plugin === false ||
			(!!ignore.plugin && ignore.plugin.includes(plugin))
		) {
			const condition = ignore.when?.(answers)
			if (condition) {
				ignore.pattern.forEach((pattern) => {
					filters[pattern] = false
				})
			}
		}
	})

	return filters
}

/**
 * Used to validate if a plugin pack is ready and usable
 * @param basePath string path to the plugin pack directory
 * @returns true or false if the plugin pack is valid
 */
export const isValidPluginPack = async (basePath: string): Promise<boolean> => {
	const source = path.resolve(basePath)

	// check that path exists
	if (!(await FSHelper.PathExists(source))) return false

	// check for plugin.js file
	const hasPromptFile = await FSHelper.PathExists(
		path.resolve(source, 'prompt.js')
	)
	if (!hasPromptFile) return false

	// check for template dir
	const hasTemplateDir = await FSHelper.PathExists(
		path.resolve(source, 'template')
	)
	if (!hasTemplateDir) return false

	// check for plugins dir
	// const hasPluginsDir = await FSHelper.PathExists(path + '/plugins')
	// if (!hasPluginsDir) return false

	return true
}

export const containsValidPluginPacks = async (
	basePath: string
): Promise<boolean> => {
	const source = path.resolve(basePath)

	// check that path exists
	if (!(await FSHelper.PathExists(source))) return false

	// get all base directory contents
	const contents = await FSHelper.ReadDir(source)

	if (contents.length === 0) return false
	// loop through all contents and check if they are plugin packs
	for (const item of contents) {
		const itemPath = path.resolve(source, item)

		// if there are any plugin packs then this is a valid directory
		if (await isValidPluginPack(itemPath)) return true
	}

	return false
}

/**
 * Gets the names of the valid plugin packs in a directory
 * @param basePath string path to the directory to find plugin packs
 * @returns an array of strings that are the name of the valid plugin packs
 */
export const getValidPluginPacks = async (
	basePath: string
): Promise<string[]> => {
	const source = path.resolve(basePath)

	// check that path exists
	if (!(await FSHelper.PathExists(source))) {
		logger.error('Supplied directory', source, 'does not exist')
		return []
	}

	// get all base directory contents
	const contents = await FSHelper.ReadDir(source)

	if (contents.length === 0) return []

	const validPacks = []
	// loop through all contents and check if they are plugin packs
	for (const item of contents) {
		const itemPath = path.resolve(source, item)
		// if there are any plugin packs then this is a valid directory
		if (await isValidPluginPack(itemPath)) validPacks.push(item)
	}

	return validPacks
}

export const getChoicesFromDir = async (
	sourcePath: string,
	onlyPluginPacks = false
): Promise<{ title: string; value: string }[]> => {
	const source = path.resolve(sourcePath)

	if (onlyPluginPacks) {
		return (await getValidPluginPacks(source)).map((packChoice) => ({
			title: packChoice,
			value: packChoice,
		}))
	}
	const directory = await FSHelper.ReadDir(source)

	const result = []
	for (const choice of directory) {
		if (await FSHelper.IsDirectory(path.resolve(source, choice))) {
			result.push({
				title: choice,
				value: choice,
			})
		}
	}
	return result
}

export const getPluginPath = (
	packSourcePath: string,
	pluginName: string
): string => {
	return path.resolve(packSourcePath, 'plugins', pluginName)
}
