import { execa } from 'execa'
import { detect } from 'detect-package-manager'
import which from 'which'
import { CreateAppError } from './errors'
import { logger } from './logger'

export interface PackageManagerInfo {
  name: string
  installCommand: string[]
  runCommand: (_script: string) => string[]
  isAvailable: boolean
}

export async function getPackageManagerInfo(preferred?: string): Promise<PackageManagerInfo> {
  const managers = {
    npm: {
      name: 'npm',
      installCommand: ['install'],
      runCommand: (script: string) => ['run', script],
      isAvailable: false
    },
    pnpm: {
      name: 'pnpm',
      installCommand: ['install'],
      runCommand: (script: string) => ['run', script],
      isAvailable: false
    },
    yarn: {
      name: 'yarn',
      installCommand: ['install'],
      runCommand: (script: string) => [script],
      isAvailable: false
    }
  }

  // Check availability
  for (const [name, info] of Object.entries(managers)) {
    try {
      await which(name)
      info.isAvailable = true
    } catch {
      info.isAvailable = false
    }
  }

  // Use preferred if available
  if (preferred && preferred in managers && managers[preferred as keyof typeof managers].isAvailable) {
    return managers[preferred as keyof typeof managers]
  }

  // Auto-detect
  try {
    const detected = await detect()
    if (detected && detected in managers && managers[detected as keyof typeof managers].isAvailable) {
      logger.debug(`Auto-detected package manager: ${detected}`)
      return managers[detected as keyof typeof managers]
    }
  } catch (error) {
    logger.debug('Failed to auto-detect package manager:', error)
  }

  // Fallback to first available
  const available = Object.values(managers).find(m => m.isAvailable)
  if (available) {
    logger.debug(`Using fallback package manager: ${available.name}`)
    return available
  }

  throw new CreateAppError(
    'No package manager found. Please install npm, pnpm, or yarn.',
    'NO_PACKAGE_MANAGER'
  )
}

export async function validatePackageManagerVersion(packageManager: string): Promise<void> {
  try {
    const { stdout } = await execa(packageManager, ['--version'], { stdio: 'pipe' })
    logger.debug(`${packageManager} version: ${stdout.trim()}`)
  } catch (error) {
    throw new CreateAppError(
      `Failed to get ${packageManager} version`,
      'PACKAGE_MANAGER_ERROR',
      error as Error
    )
  }
}