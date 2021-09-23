import commander from 'commander'
import path from 'path'
import chalk from 'chalk'
import currentProject from '../package.json'
import { Cli, Config as DevConfig } from './dev'
import { Stack } from './stack'

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
		.option(
			'-D --develop',
			'run the program in plugin development mode with hot reloading'
		)
		.parse(process.argv)

	const [projectDir] = program.args
	const { source, debug, develop } = program

	const cli = new Cli({
		generator,
		projectDir,
		sourceDir: source,
		debug,
		develop,
		enginePackage: currentProject,
	} as DevConfig)

	await cli.run()

	const stack = new Stack(cli.stackConfig)

	stack.run()
}

export default cli
