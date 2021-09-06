export type SourceResponse = { path?: string; error?: string }
export type GetSourceFn = (
	source: string | undefined
) => Promise<SourceResponse>
