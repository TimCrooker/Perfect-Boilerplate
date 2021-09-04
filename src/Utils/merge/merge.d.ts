export type PkgType = Record<string, unknown>

export type PkgFnType = {
	apply: (
		pkg: PkgType,
		answers: Record<string, string | string[] | boolean | undefined>
	) => Record<string, unknown>
}

export type MergerFn = (
	base: Record<string, unknown>,
	pluginsPath: string,
	plugins: string[],
	fileName: string,
	mergeOptions?: Record<string, unknown>
) => Record<string, unknown>

export type PackageMergerFn = (
	base: Record<string, unknown>,
	pluginsPath: string,
	plugins: string[],
	answers: Record<string, string | string[] | boolean | undefined>
) => Record<string, unknown>

export type AsyncMergerFn = (
	base: Record<string, unknown>,
	pluginsPath: string,
	plugins: string[]
) => Promise<Record<string, unknown>>

export type PluginData = Record<'name' | 'description' | 'url', string>
