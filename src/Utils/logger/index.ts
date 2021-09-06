/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk, { Color } from 'chalk'

export type LogLevel = 1 | 2 | 3 | 4

export const DEV = 'dev'
export const RUN = 'run'
export const DEBUG = 'debug'
export type LogMode = typeof DEV | typeof RUN | typeof DEBUG

interface Options {
	logLevel?: LogLevel
	logMode?: LogMode
	mock?: boolean
}

export const logLevelFromMode = (mode: LogMode): LogLevel => {
	let logLevel: LogLevel = 1
	switch (mode) {
		case DEV:
			logLevel = 4
			break
		case RUN:
			logLevel = 1
			break
		case DEBUG:
			logLevel = 3
			break
	}
	return logLevel
}

export class Logger {
	options: Required<Options>
	lines: string[]

	constructor(options?: Options) {
		this.options = Object.assign(
			{
				logLevel: 1,
				logMode: RUN,
				mock: false,
			},
			options
		)
		this.lines = []
	}

	setOptions(options: Options): void {
		Object.assign(this.options, options)
		if (options.logMode) {
			this.options.logLevel = logLevelFromMode(options.logMode)
		}
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

	// level: 3
	success(...args: any[]): void {
		this.status('green', 'success', ...args)
	}

	// level: 3
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
}

export const logger = new Logger()
