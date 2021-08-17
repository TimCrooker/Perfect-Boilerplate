import { FSHelper, getSource } from '@Utils'
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
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .description(currentProject.description)
    .option('-s, --source <source-path>', 'specify a custom source of plugins')
    .option('-d, --debug', 'run the program in debug mode')
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

  const source = await getSource(program.source)

  let { path: sourcePath } = source
  const { error: sourceError } = source

  // error when supplied source doesn't exist
  if (sourceError) {
    console.error(`${chalk.bold`${sourceError}`}`)
    console.log('Source can be a remote git repository or a local path.')
    console.log()
    console.log('You provided:')
    console.log(`${chalk.blueBright(program.source)}`)
    process.exit(1)
  }

  const packTypes = []

  /**
   * Verify validity and load plugin packs from supplied directory
   */
  if (sourcePath) {
    const pluginPacks = await FSHelper.ReadDir(sourcePath)

    // error when the plugin source contains no plugins
    if (pluginPacks.length === 0) {
      console.log()
      console.error(
        chalk.red('ERROR: ') + 'The plugin source directory has no plugins'
      )
      console.log()
      process.exit(1)
    }

    // create a list of all plugin packs and determine if they are valid
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

    // error when none of the supplied plugin packs are valid
    if (packTypes.length === 0) {
      console.log()
      console.error(
        chalk.red('ERROR: ') + 'NONE of the supplied plugin packs are valid'
      )
      console.log()
      process.exit(1)
    }
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
