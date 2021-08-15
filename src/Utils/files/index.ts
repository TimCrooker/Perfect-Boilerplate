import { access, readdir } from 'fs'
import { promisify } from 'util'

export const FSHelper = {
  PathExists: async (path: string): Promise<boolean> => {
    try {
      await promisify(access)(path)
      return true
    } catch (e) {
      return false
    }
  },

  ReadDir: async (path: string): Promise<string[]> => {
    try {
      return await promisify(readdir)(path)
    } catch (e) {
      return []
    }
  },

  ValidPluginPack: async (path: string): Promise<boolean> => {
    // check that path exists
    const validPath = await FSHelper.PathExists(path)
    if (!validPath) return false

    // check for plugin.js file
    const hasPluginFile = await FSHelper.PathExists(path + '/prompt.js')
    if (!hasPluginFile) return false

    // check for template dir
    const hasTemplateDir = await FSHelper.PathExists(path + '/template')
    if (!hasTemplateDir) return false

    // check for plugins dir
    const hasPluginsDir = await FSHelper.PathExists(path + '/plugins')
    if (!hasPluginsDir) return false

    return true
  },
}
