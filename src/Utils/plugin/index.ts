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
      console.log(acc, key, value)
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
