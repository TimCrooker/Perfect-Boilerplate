type PostInstallFn = (opts: {
	name: string
	dir: string
	pm: 'yarn' | 'npm'
}) => void
