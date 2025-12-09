/**
 * Error thrown when an environment variable has an invalid value.
 */
export class EnvParseError extends Error {
	constructor(
		public readonly key: string,
		public readonly value: string,
		public readonly expectedType: string,
	) {
		super(`Invalid env var "${key}": expected ${expectedType}, got "${value}"`)
		this.name = 'EnvParseError'
	}
}

/**
 * Error thrown when a required environment variable is missing.
 */
export class EnvMissingError extends Error {
	constructor(public readonly key: string) {
		super(`Missing required env var "${key}"`)
		this.name = 'EnvMissingError'
	}
}

/**
 * Accesses an environment variable with type safety.
 *
 * Type coercion rules (based on defaultValue type):
 * - **string**: Returns raw value as-is
 * - **number**: Parses as number, throws EnvParseError if NaN
 * - **boolean**: Accepts 'true'/'false' (case-insensitive), throws on other values
 *
 * @param key - The name of the environment variable
 * @param defaultValue - Optional default value. If not provided, the environment variable is required.
 * @returns The value of the environment variable, or the default value if the variable is missing/empty.
 * @throws {EnvMissingError} If the variable is missing/empty and no default value is provided.
 * @throws {EnvParseError} If the value cannot be parsed into the expected type.
 *
 * @example
 * ```typescript
 * import { env } from '@redstrike/backend-toolkit'
 *
 * const port = env('PORT', 3000)        // number
 * const debug = env('DEBUG', false)     // boolean
 * const host = env('HOST', 'localhost') // string
 * const apiKey = env<string>('API_KEY') // Throws if missing
 * ```
 */
export function env<T extends string | number | boolean = string>(key: string, defaultValue?: T): T {
	const raw = process.env[key]

	// Return default if value is missing or empty
	if (raw === undefined || raw === '') {
		if (defaultValue === undefined) {
			throw new EnvMissingError(key)
		}
		return defaultValue
	}

	// Type coercion based on defaultValue type
	if (typeof defaultValue === 'number') {
		const parsed = Number(raw)
		if (Number.isNaN(parsed)) {
			throw new EnvParseError(key, raw, 'number')
		}
		return parsed as T
	}

	if (typeof defaultValue === 'boolean') {
		const lower = raw.toLowerCase()
		if (lower === 'true') return true as T
		if (lower === 'false') return false as T
		throw new EnvParseError(key, raw, 'boolean (true/false)')
	}

	// Default: return as string
	return raw as T
}
