import fs from 'fs-extra'
import path from 'path'
import { execa } from 'execa'
import validateNpmName from 'validate-npm-package-name'
import semver from 'semver'
import { CreateAppError } from './errors'

export function validateProjectName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new CreateAppError('Project name is required', 'INVALID_PROJECT_NAME')
  }

  const validation = validateNpmName(name)
  if (!validation.validForNewPackages) {
    const error = validation.errors?.[0] || validation.warnings?.[0] || 'Invalid project name'
    throw new CreateAppError(`Invalid project name: ${error}`, 'INVALID_PROJECT_NAME')
  }

  // Additional checks
  if (name.length > 214) {
    throw new CreateAppError('Project name is too long (max 214 characters)', 'INVALID_PROJECT_NAME')
  }

  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw new CreateAppError('Project name contains invalid characters', 'INVALID_PROJECT_NAME')
  }
}

export async function validateEnvironment(): Promise<void> {
  // Check Node.js version
  const nodeVersion = process.version
  if (!semver.gte(nodeVersion, '18.0.0')) {
    throw new CreateAppError(
      `Node.js 18.0.0 or higher is required. You are using ${nodeVersion}`,
      'UNSUPPORTED_NODE_VERSION'
    )
  }

  // Check if git is available (for git init)
  try {
    await execa('git', ['--version'], { stdio: 'pipe' })
  } catch {
    // Git is optional, just warn
    console.warn('⚠️  Git not found. Git repository initialization will be skipped.')
  }
}

export async function validateProjectPath(projectPath: string): Promise<void> {
  const resolvedPath = path.resolve(projectPath)
  
  // Check if path is writable
  try {
    await fs.access(path.dirname(resolvedPath), fs.constants.W_OK)
  } catch (error) {
    throw new CreateAppError(
      `Cannot write to directory: ${path.dirname(resolvedPath)}`,
      'PERMISSION_DENIED',
      error as Error
    )
  }

  // Check if directory exists and is not empty
  if (await fs.pathExists(resolvedPath)) {
    const files = await fs.readdir(resolvedPath)
    if (files.length > 0) {
      // Filter out common hidden files that are safe to ignore
      const significantFiles = files.filter(file => 
        !file.startsWith('.') || 
        !['.git', '.gitignore', '.DS_Store'].includes(file)
      )
      
      if (significantFiles.length > 0) {
        throw new CreateAppError(
          `Directory ${projectPath} is not empty`,
          'DIRECTORY_NOT_EMPTY'
        )
      }
    }
  }
}

export function validateTemplate(template: string): void {
  const validTemplates = ['minimal', 'dashboard', 'saas', 'ecommerce', 'landing']
  
  if (!validTemplates.includes(template)) {
    throw new CreateAppError(
      `Invalid template: ${template}. Valid templates are: ${validTemplates.join(', ')}`,
      'INVALID_TEMPLATE'
    )
  }
}

export function validatePackageManager(packageManager: string): void {
  const validManagers = ['npm', 'pnpm', 'yarn']
  
  if (!validManagers.includes(packageManager)) {
    throw new CreateAppError(
      `Invalid package manager: ${packageManager}. Valid options are: ${validManagers.join(', ')}`,
      'INVALID_PACKAGE_MANAGER'
    )
  }
}