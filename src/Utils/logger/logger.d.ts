import { DEV, RUN, DEBUG } from '.'

export type LogMode = typeof DEV | typeof RUN | typeof DEBUG

export type LogLevel = 1 | 2 | 3 | 4

interface Options {
	logLevel?: LogLevel
	mock?: boolean
}
