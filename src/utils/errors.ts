import chalk from 'chalk'

export class CreateAppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'CreateAppError'
  }
}

export function handleError(error: unknown, verbose = false): void {
  if (error instanceof CreateAppError) {
    console.error(chalk.red(`❌ ${error.message}`))
    if (verbose && error.cause) {
      console.error(chalk.gray('Caused by:'), error.cause.message)
    }
  } else if (error instanceof Error) {
    console.error(chalk.red('❌ An unexpected error occurred:'))
    console.error(chalk.red(error.message))
    if (verbose) {
      console.error(chalk.gray('Stack trace:'))
      console.error(chalk.gray(error.stack))
    }
  } else {
    console.error(chalk.red('❌ An unknown error occurred'))
    if (verbose) {
      console.error(chalk.gray(String(error)))
    }
  }
}

export function exitWithError(error: unknown, verbose = false): never {
  handleError(error, verbose)
  process.exit(1)
}
