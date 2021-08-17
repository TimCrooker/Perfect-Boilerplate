import merge from 'deepmerge'
import { readFile } from 'fs'
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
 * @returns
 */
const getPluginFile: <ReturnType extends any>(
  pluginPath: string,
  pluginName: string,
  fileName: string
) => ReturnType | undefined = (pluginPath, pluginName, fileName) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pluginFile = require(path.join(
      pluginPath,
      'plugins',
      pluginName,
      fileName
    ))

    return pluginFile
  } catch (e) {
    return undefined
  }
}

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
 *
 * @param base base dictionary of plugins
 * @param pluginsPath path to the plugin pack directory
 * @param plugins array of all selected plugins
 * @param fileName target file for the plugins
 * @returns all of the plugins' meta.js files combined into one dictionary object
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
    if (['npm', 'yarn', 'react', 'nextjs', 'refine'].includes(plugin)) return
    const file = getPluginFile<PkgType>(pluginsPath, plugin, fileName) ?? {}

    ;(baseFile.plugins as PluginData[]).push({
      name: (file.name as string) ?? plugin,
      description: (file.description as string) ?? '',
      url: (file.url as string) ?? '',
    })
  })
  return baseFile
}

export const mergeBabel: AsyncMergerFn = async (base, pluginsPath, plugins) => {
  const baseBabel = { ...base }

  const pluginRcs = await Promise.all(
    plugins.map(async (plugin) => {
      const str = await getStringFile(pluginsPath, plugin, '.babelrc')
      const parsed = JSON.parse(str)

      return parsed ?? {}
    })
  )

  const merged = merge.all([baseBabel, ...pluginRcs]) as Record<string, unknown>

  const uniquePresets: string[] = []
  const presetsSet = new Set((merged.presets as string[]) ?? [])
  presetsSet.forEach((el) => uniquePresets.push(el))
  merged.presets = uniquePresets

  return merged
}

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

  return merge.all([basePkg, ...pluginPkgs]) as Record<string, unknown>
}
