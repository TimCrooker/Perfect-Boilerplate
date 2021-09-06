import { logger } from '../../Perfect-Boilerplate/src/Utils/logger'
import { spinner } from './Utils/spinner'

export class DevError extends Error {
	sao: boolean
	cmdOutput?: string

	constructor(message: string) {
		super(message)
		this.sao = true
		this.name = this.constructor.name
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = new Error(message).stack
		}
	}
}

export function handleError(error: Error | DevError): void {
	spinner.stop()
	if (error instanceof DevError) {
		if (error.cmdOutput) {
			console.error(error.cmdOutput)
		}
		logger.error(error.message)
		logger.debug(error.stack)
	} else if (error.name === 'CACError') {
		logger.error(error.message)
	} else {
		logger.error(error.stack)
	}
	process.exit(1)
}
