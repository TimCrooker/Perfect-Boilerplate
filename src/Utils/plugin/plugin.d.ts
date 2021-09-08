export interface ExtendType extends Record<string, unknown> {
	_app: {
		import: string[]
		inner: string[]
		wrapper: [string, string][]
	}
	_document: {
		import: string[]
		initialProps: string[]
	}
}

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
