import { extendBase } from '@Utils'

export type ExtendType = typeof extendBase

export type Answer = string | string[] | boolean | undefined

export type AnswersType = Record<string, Answer>

export type IgnoreType = {
	plugin?: string[]
	when: (answers: Record<string, Answer>) => boolean
	pattern: string[]
}

export type IgnoreHandlerFn = (
	ignores: IgnoreType[],
	answers: AnswersType,
	plugin: string
) => Record<string, false>
