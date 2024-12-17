const isServer = typeof window === 'undefined'

class CustomLogger {
  private log(level: string, message: string, ...meta: any[]) {
    const timestamp = new Date().toISOString()
    const formattedMessage = `${timestamp} [${level}]: ${message}`
    
    if (isServer) {
      // Server-side logging
      console[level as 'log' | 'info' | 'warn' | 'error'](formattedMessage, ...meta)
    } else {
      // Client-side logging
      if (level === 'error') {
        console.error(formattedMessage, ...meta)
      } else {
        console.log(formattedMessage, ...meta)
      }
    }
  }

  info(message: string, ...meta: any[]) {
    this.log('info', message, ...meta)
  }

  warn(message: string, ...meta: any[]) {
    this.log('warn', message, ...meta)
  }

  error(message: string, ...meta: any[]) {
    this.log('error', message, ...meta)
  }

  debug(message: string, ...meta: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, ...meta)
    }
  }
}

export const logger = new CustomLogger()