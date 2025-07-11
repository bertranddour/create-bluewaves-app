import chalk from 'chalk'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  error(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(chalk.red('❌'), message, ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(chalk.yellow('⚠️ '), message, ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(chalk.blue('ℹ️ '), message, ...args)
    }
  }

  success(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(chalk.green('✅'), message, ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.debug(chalk.gray('🐛'), message, ...args)
    }
  }

  step(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(chalk.cyan('🔄'), message, ...args)
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

export const logger = new Logger()