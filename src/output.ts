export default {
	error: (message: string) => `\x1b[31m${message}\x1b[0m`,
	info: (message: string) => `\x1b[36m${message}\x1b[0m`,
	success: (message: string) => `\x1b[32m${message}\x1b[0m`,
}
