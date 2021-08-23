import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'
import validate from 'validate-npm-package-name'

import {
  BinaryHelper,
  concatExtend,
  extendBase,
  getPluginsArray,
  handleIgnore,
  mergeBabel,
  mergeJSONFiles,
  mergePackages,
  mergePluginData,
  tips,
} from '@Utils'
import { Action, GeneratorConfig } from '../@types/sao'

const saoConfig: GeneratorConfig = {
  /**
   * Runs upon instantiation of the SAO generator
   */
  prompts(sao) {
    const {
      appName,
      extras: { paths },
    } = sao.opts

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sourcePrompts = require(path.resolve(paths.sourcePath, 'prompt.js'))

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
    /**
     * Package Manager
     */

    sao.answers.pm = BinaryHelper.CanUseYarn() ? sao.answers.pm : 'npm'

    const pmRun = sao.answers.pm === 'yarn' ? 'yarn' : 'npm run'

    /**
     * Extend.js data
     */
    const { sourcePath } = sao.opts.extras.paths
    const { projectType } = sao.opts.extras

    const pluginAnswers = { ...sao.answers }
    delete pluginAnswers.name
    const selectedPlugins = getPluginsArray(pluginAnswers)
    const extendData = concatExtend(
      extendBase,
      selectedPlugins,
      sourcePath,
      sao.answers
    )

    /**
     * Plugins meta data
     */
    const pluginsData = mergePluginData(
      {},
      sourcePath,
      selectedPlugins,
      'meta.json'
    ).plugins

    const metaJSONPath =
      projectType === 'react' ? 'src/meta.json' : 'public/meta.json'

    /**
     * Return
     */
    return {
      ...sao.answers,
      projectType,
      answers: sao.answers,
      selectedPlugins,
      pmRun,
      pluginsData,
      metaJSONPath,
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
   * ADD:
   *
   * MOVE:
   *
   * MODIFY:
   *
   * REMOVE:
   *
   * @returns array of action objects
   */
  async actions(sao) {
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

    const { sourcePath } = sao.opts.extras.paths

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
    const sourcePrompts = require(path.resolve(sourcePath, 'prompt.js'))

    /**
     *
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
  async prepare() {
    tips.preInstall()
  },

  /**
   * Runs after actions are done being executed
   */
  async completed(sao) {
    const { debug } = sao.opts.extras

    /**
     * Git init and install packages
     */
    if (!debug) {
      sao.gitInit()
      await sao.npmInstall({
        npmClient: this.answers.pm,
        installArgs: ['--silent'],
      })
    }

    /**
     * Format generated project
     */
    // await promisify(exec)(`npx prettier "${sao.outDir}" --write`)

    /**
     * Create an initial commit
     */
    if (!debug) {
      try {
        // add
        await promisify(exec)(
          `git --git-dir="${sao.outDir}"/.git/ --work-tree="${sao.outDir}"/ add -A`
        )
        // commit
        await promisify(exec)(
          `git --git-dir="${sao.outDir}"/.git/ --work-tree="${sao.outDir}"/ commit -m "initial commit with superstack"`
        )
        sao.logger.info('created an initial commit.')
      } catch (_) {
        console.log(chalk.yellow`An error occured while creating git commit.`)
      }
    }

    /**
     * Show messages after completion
     */
    tips.postInstall({
      name: sao.opts.appName ?? '',
      dir: sao.outDir,
      pm: sao.answers.pm,
    })
  },
}

module.exports = saoConfig
