import { FSHelper, getPackChoicesFromDir, getSource, runSao } from '@Utils'
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
        .option(
            '-s, --source <source-path>',
            'specify a custom source of plugins'
        )
        .option('-d, --debug', 'run the program in debug mode')
        .parse(process.argv)

    const [projectDir] = program.args

    console.log(projectDir)
    // Check target project-directory exists
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

    /**
     * Verify plugin packs are valid and load them from supplied directory
     */

    const packTypes = await getPackChoicesFromDir(sourcePath as string, true)

    /**
     * User selects app type to build
     */

    const { projectType } = await prompts({
        type: 'select',
        name: 'projectType',
        message: 'Select your project type',
        choices: packTypes,
    })

    sourcePath = `${sourcePath}/${projectType}`

    /**
     * Set up SAO heiarchy for CUSTOM stacks
     */

    const saoInstances: SAO[] = []

    if (projectType === 'Custom') {
        const stackChoices = await getPackChoicesFromDir(sourcePath, true)

        const { projectStack } = await prompts({
            type: 'select',
            name: 'projectStack',
            message: 'Select the levels of the stack',
            choices: stackChoices,
        })

        let frontendOutDir = projectDir
        let backendOutDir = projectDir

        if (projectStack === 'fullstack') {
            const fullstackSrcPath = `${sourcePath}/${projectStack}`
            saoInstances.push(
                new SAO({
                    generator,
                    outDir: projectDir,
                    logLevel: program.debug ? 4 : 1,
                    appName: projectDir,
                    extras: {
                        debug: !!program.debug,
                        paths: {
                            sourcePath: fullstackSrcPath,
                        },
                    },
                } as Options)
            )
            frontendOutDir = `${projectDir}/client`
            backendOutDir = `${projectDir}/server`
        }
        if (projectStack === 'frontend' || projectStack === 'fullstack') {
            let frontendSrcPath = `${sourcePath}/frontend`
            const frontendChoices = await getPackChoicesFromDir(frontendSrcPath)

            const { frontendType } = await prompts({
                type: 'select',
                name: 'frontendType',
                message: 'Select your front-end framework',
                choices: frontendChoices,
            })

            frontendSrcPath = `${frontendSrcPath}/${frontendType}`

            saoInstances.push(
                new SAO({
                    generator,
                    outDir: frontendOutDir,
                    logLevel: program.debug ? 4 : 1,
                    appName: projectDir,
                    extras: {
                        debug: !!program.debug,
                        paths: {
                            sourcePath: frontendSrcPath,
                        },
                    },
                    answers: {
                        name: 'Client',
                    },
                } as Options)
            )
        }
        if (projectStack === 'backend' || projectStack === 'fullstack') {
            let backendSrcPath = `${sourcePath}/backend`
            const backendChoices = await getPackChoicesFromDir(backendSrcPath)

            const { backendType } = await prompts({
                type: 'select',
                name: 'backendType',
                message: 'Select your back-end framework',
                choices: backendChoices,
            })

            backendSrcPath = `${backendSrcPath}/${backendType}`

            saoInstances.push(
                new SAO({
                    generator,
                    outDir: backendOutDir,
                    logLevel: program.debug ? 4 : 1,
                    appName: projectDir,
                    extras: {
                        debug: !!program.debug,
                        paths: {
                            sourcePath: backendSrcPath,
                        },
                    },
                    answers: {
                        name: 'Server',
                    },
                } as Options)
            )
        }
    } else {
        saoInstances.push(
            new SAO({
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
        )
    }

    /**
     * Run all SAO instances
     */

    for (const sao of saoInstances) {
        await runSao(sao, program)
    }
}

export default cli
