/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk, { Color } from 'chalk'
import { LogLevel, Options } from './logger'

export const logLevelFromMode = (dev: boolean, debug: boolean): LogLevel => {
	let logLevel: LogLevel = 1
	if (dev) logLevel = 3
	if (debug) logLevel = 4
	return logLevel
}

export class Logger {
	options: Required<Options>
	lines: string[]

	constructor(options?: Options) {
		this.options = Object.assign(
			{
				logLevel: 1,
				mock: false,
			},
			options
		)
		this.lines = []
	}

	setOptions(options: Options): void {
		Object.assign(this.options, options)
	}

	log(...args: any[]): void {
		if (this.options.mock) {
			this.lines.push(args.join(' '))
		} else {
			console.log(...args)
		}
	}

	// level: 4
	debug(...args: any[]): void {
		if (this.options.logLevel < 4) {
			return
		}

		this.status('magenta', 'debug', ...args)
	}

	// level: 3
	success(...args: any[]): void {
		this.status('green', 'success', ...args)
	}

	tip(...args: any[]): void {
		this.status('blue', 'tip', ...args)
	}

	info(...args: any[]): void {
		this.status('cyan', 'info', ...args)
	}

	status(color: typeof Color, label: string, ...args: any[]): void {
		if (this.options.logLevel < 3) {
			return
		}
		this.log(chalk[color](label), ...args)
	}

	// level: 2
	warn(...args: any[]): void {
		if (this.options.logLevel < 2) {
			return
		}
		this.log(chalk.yellow('warning'), ...args)
	}

	// level: 1
	error(...args: any[]): void {
		if (this.options.logLevel < 1) {
			return
		}
		process.exitCode = process.exitCode || 1
		this.log(chalk.red('error'), ...args)
	}
}

export const logger = new Logger()
