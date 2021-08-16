import { FSHelper } from '@Utils'
import commander from 'commander'
import path from 'path'
import prompts from 'prompts'
import { Options, SAO } from 'sao'
import chalk from 'chalk'

import currentProject from '../package.json'

const generator = path.resolve(__dirname, './')

const cli = async (): Promise<void> => {
  /**
   * Get target project-directory
   */
  const program = commander
    .name(currentProject.name)
    .version(currentProject.version)
    .arguments('<project-directory>')
    .usage('<project-directory>')
    .description(currentProject.description)
    .parse(process.argv)

  /**
   * Check target project-directory exists
   */
  const [projectDir] = program.args

  // handle undefined project dir
  if (projectDir === undefined) {
    console.error('No specified project directory')
    process.exit(1)
  }

  /**
   * Get the plugin source directory
   */

  // directory with all plugin packs
  let sourcePath = './plugins'

  // check if sourcePath exists
  const validPluginSource = await FSHelper.PathExists(sourcePath)

  // error when sourcePath doesn't exist
  if (!validPluginSource) {
    console.log()
    console.error(
      chalk.red('ERROR: ') +
        'The supplied plugin source directory does not exist'
    )
    console.log()
    process.exit(1)
  }

  /**
   *  Ensure validity of plugin packs supplied
   */

  const packTypes = []

  const pluginPacks = await FSHelper.ReadDir(sourcePath)

  // error when the source directory contains no subdirectories
  if (pluginPacks.length === 0) {
    console.log()
    console.error(
      chalk.red('ERROR: ') + 'The plugin source directory has no plugins'
    )
    console.log()
    process.exit(1)
  }

  // create an array of all plugin packs and determine if they are valid
  for (const pluginPack of pluginPacks) {
    const pluginDirPath = `${sourcePath}/${pluginPack}`

    const packIsValid = await FSHelper.ValidPluginPack(pluginDirPath)

    if (packIsValid) {
      packTypes.push({
        title: pluginPack,
        value: pluginPack,
      })
    } else {
      console.error(
        chalk.red('ERROR: ') +
          'The plugin pack ' +
          chalk.cyan(pluginPack) +
          ' at the directory ' +
          chalk.cyan(pluginDirPath) +
          ' is invalid'
      )
      console.log()
    }
  }

  // error when there are plugin pack directories supplied but none of them are valid
  if (packTypes.length === 0) {
    console.log()
    console.error(
      chalk.red('ERROR: ') + 'NONE of the supplied plugin packs are valid'
    )
    console.log()
    process.exit(1)
  }

  /**
   * User selects plugin pack to use
   */

  const { projectType } = await prompts({
    type: 'select',
    name: 'projectType',
    message: 'Select your project type',
    choices: packTypes,
  })

  sourcePath = `${sourcePath}/${projectType}`

  /**
   * Create and run new SAO instance with above CLI details
   */

  const sao = new SAO({
    generator,
    outDir: projectDir,
    logLevel: program.debug ? 4 : 1,
    appName: projectDir,
    extras: {
      debug: !!program.debug,
      paths: {
        sourcePath,
      },
    },
  } as Options)

  await sao.run().catch((err) => {
    console.log(`${program.name()} has encountered an error.`)
    console.log()
    console.log(`If you think this is caused by a bug. Please check out:`)
    console.log(currentProject.author)
    console.log()
    console.error('ERROR', err)
    process.exit(1)
  })
}

export default cli
