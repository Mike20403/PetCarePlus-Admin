// Logger utility for API requests and responses
export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3
}

class Logger {
	private level: LogLevel
	private isDevelopment: boolean

	constructor() {
		this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development'
		this.level = this.getLogLevel()
	}

	private getLogLevel(): LogLevel {
		const configLevel = import.meta.env.VITE_LOG_LEVEL?.toLowerCase()
		switch (configLevel) {
			case 'debug':
				return LogLevel.DEBUG
			case 'info':
				return LogLevel.INFO
			case 'warn':
				return LogLevel.WARN
			case 'error':
				return LogLevel.ERROR
			default:
				return this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR
		}
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.level
	}

	private formatMessage(level: string, message: string, data?: any): void {
		const timestamp = new Date().toISOString()
		const prefix = `[${timestamp}] [${level}]`

		if (data) {
			console.log(`${prefix} ${message}`, data)
		} else {
			console.log(`${prefix} ${message}`)
		}
	}

	debug(message: string, data?: any): void {
		if (this.shouldLog(LogLevel.DEBUG)) {
			this.formatMessage('DEBUG', message, data)
		}
	}

	info(message: string, data?: any): void {
		if (this.shouldLog(LogLevel.INFO)) {
			this.formatMessage('INFO', message, data)
		}
	}

	warn(message: string, data?: any): void {
		if (this.shouldLog(LogLevel.WARN)) {
			this.formatMessage('WARN', message, data)
		}
	}

	error(message: string, data?: any): void {
		if (this.shouldLog(LogLevel.ERROR)) {
			this.formatMessage('ERROR', message, data)
		}
	}

	// API-specific logging methods
	logRequest(config: any): void {
		if (this.isDevelopment && this.shouldLog(LogLevel.DEBUG)) {
			this.debug('API Request', {
				method: config.method?.toUpperCase(),
				url: config.url,
				params: config.params,
				data: config.data,
				headers: this.sanitizeHeaders(config.headers)
			})
		}
	}

	logResponse(response: any): void {
		if (this.isDevelopment && this.shouldLog(LogLevel.DEBUG)) {
			this.debug('API Response', {
				status: response.status,
				statusText: response.statusText,
				url: response.config?.url,
				data: response.data
			})
		}
	}

	logError(error: any): void {
		if (this.shouldLog(LogLevel.ERROR)) {
			this.error('API Error', {
				message: error.message,
				status: error.response?.status,
				statusText: error.response?.statusText,
				url: error.config?.url,
				data: error.response?.data
			})
		}
	}

	private sanitizeHeaders(headers: any): any {
		if (!headers) return headers

		const sanitized = { ...headers }
		// Remove sensitive headers from logs
		if (sanitized.Authorization) {
			sanitized.Authorization = 'Bearer ***'
		}
		return sanitized
	}
}

export const logger = new Logger()