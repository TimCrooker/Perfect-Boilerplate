import merge from 'deepmerge'
import { readFile, readFileSync } from 'fs'
import path from 'path'
import { promisify } from 'util'
import {
	AsyncMergerFn,
	MergerFn,
	PackageMergerFn,
	PkgFnType,
	PkgType,
	PluginData,
} from './merge'

/**
 *
 * @param pluginPath path to the plugin pack directory
 * @param pluginName name of the plugin to target
 * @param fileName name of the file inside of a plugin to target
 * @returns the file being targeted in the specified plugin
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPluginFile: <ReturnType extends any>(
	pluginPath: string,
	pluginName: string,
	fileName: string
) => ReturnType | undefined = (pluginPath, pluginName, fileName) => {
	try {
		const rawData = readFileSync(
			path.join(pluginPath, 'plugins', pluginName, fileName),
			'utf8'
		)
		const pluginFile = JSON.parse(rawData)
		return pluginFile
	} catch (e) {
		return undefined
	}
}

/**
 * Stringify the contents of a file inside of the plugin provided
 *
 * @param pluginPath path to the plugin pack directory
 * @param pluginName name of the plugin to target
 * @param fileName name of the file inside of the plugin to target
 */
const getStringFile = async (
	pluginPath: string,
	pluginName: string,
	fileName: string
) => {
	try {
		const str = await promisify(readFile)(
			path.join(pluginPath, 'plugins', pluginName, fileName),
			'utf8'
		)
		if (typeof str === 'string') {
			return str
		} else {
			return '{}'
		}
	} catch (e) {
		return '{}'
	}
}

/**
 * Combine JSON files of the same type into one file using deepMerge
 *
 * @param base
 * @param pluginsPath
 * @param plugins
 * @param fileName
 * @param mergeOptions
 * @returns
 */
export const mergeJSONFiles: MergerFn = (
	base = {},
	pluginsPath,
	plugins,
	fileName,
	mergeOptions
) => {
	const baseFile = { ...base }
	const pluginFiles = plugins.map((plugin) => {
		const file = getPluginFile<PkgType>(pluginsPath, plugin, fileName)
		return file ?? {}
	})
	return merge.all([baseFile, ...pluginFiles], mergeOptions) as Record<
		string,
		unknown
	>
}

/**
 * Combine all plugin meta.json data into one document
 *
 * @param base base dictionary of plugins
 * @param pluginsPath path to the plugin pack directory
 * @param plugins array of all selected plugins
 * @param fileName target file for the plugins
 */
export const mergePluginData: MergerFn = (
	base = {},
	pluginsPath,
	plugins,
	fileName
) => {
	const baseFile = { ...base }
	baseFile.plugins = []
	plugins.map((plugin) => {
		if (['npm', 'yarn', 'react', 'nextjs', 'refine'].includes(plugin))
			return
		const file = getPluginFile<PkgType>(pluginsPath, plugin, fileName) ?? {}

		;(baseFile.plugins as PluginData[]).push({
			name: (file.name as string) ?? plugin,
			description: (file.description as string) ?? '',
			url: (file.url as string) ?? '',
		})
	})
	return baseFile
}

/**
 * combine all .babelrc files together into one
 *
 * @param base base dictionary of plugins
 * @param pluginsPath path to the plugin pack directory
 * @param plugins array of all selected plugins
 */
export const mergeBabel: AsyncMergerFn = async (base, pluginsPath, plugins) => {
	const baseBabel = { ...base }

	const pluginRcs = await Promise.all(
		plugins.map(async (plugin) => {
			const str = await getStringFile(pluginsPath, plugin, '.babelrc')
			const parsed = JSON.parse(str)

			return parsed ?? {}
		})
	)

	const merged = merge.all([baseBabel, ...pluginRcs]) as Record<
		string,
		unknown
	>

	const uniquePresets: string[] = []
	const presetsSet = new Set((merged.presets as string[]) ?? [])
	presetsSet.forEach((el) => uniquePresets.push(el))
	merged.presets = uniquePresets

	return merged
}

/**
 * merge package.json and package.js files together into the final package.json
 *
 * @param base all of the data provided by the saoFile data function
 * @param pluginsPath
 * @param plugins
 * @param answers
 */
export const mergePackages: PackageMergerFn = (
	base = {},
	pluginsPath,
	plugins,
	answers
) => {
	const basePkg = { ...base }
	const pluginPkgs = plugins.map((plugin) => {
		const pluginPkg = getPluginFile<PkgType>(
			pluginsPath,
			plugin,
			'package.json'
		)
		const pluginPkgFn = getPluginFile<PkgFnType>(
			pluginsPath,
			plugin,
			'package.js'
		)

		if (pluginPkgFn && pluginPkg) {
			const fnPkg = pluginPkgFn.apply(pluginPkg, answers)
			return fnPkg
		} else if (pluginPkg) {
			return pluginPkg
		}
		return {}
	})

	const result = merge.all([basePkg, ...pluginPkgs]) as Record<
		string,
		unknown
	>

	return result
}
