import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  validateProjectName,
  validateTemplate,
  validatePackageManager,
  validateEnvironment,
  validateProjectPath,
} from '../src/utils/validation'
import { CreateAppError } from '../src/utils/errors'
import { execa } from 'execa'
import fs from 'fs-extra'

// Mock dependencies
vi.mock('execa')
vi.mock('fs-extra')

const mockedExeca = vi.mocked(execa)
const mockedFs = vi.mocked(fs)

describe('validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('validateProjectName', () => {
    it('should accept valid project names', () => {
      expect(() => validateProjectName('my-app')).not.toThrow()
      expect(() => validateProjectName('my_app')).not.toThrow()
      expect(() => validateProjectName('myapp123')).not.toThrow()
    })

    it('should reject invalid project names', () => {
      expect(() => validateProjectName('')).toThrow(CreateAppError)
      expect(() => validateProjectName('My App')).toThrow(CreateAppError)
      expect(() => validateProjectName('my-app/')).toThrow(CreateAppError)
      expect(() => validateProjectName('../my-app')).toThrow(CreateAppError)
    })

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(215)
      expect(() => validateProjectName(longName)).toThrow(CreateAppError)
    })

    it('should reject npm reserved names', () => {
      expect(() => validateProjectName('node_modules')).toThrow(CreateAppError)
      expect(() => validateProjectName('favicon.ico')).toThrow(CreateAppError)
    })
  })

  describe('validateTemplate', () => {
    it('should accept valid templates', () => {
      expect(() => validateTemplate('minimal')).not.toThrow()
      expect(() => validateTemplate('dashboard')).not.toThrow()
      expect(() => validateTemplate('saas')).not.toThrow()
      expect(() => validateTemplate('ecommerce')).not.toThrow()
      expect(() => validateTemplate('landing')).not.toThrow()
    })

    it('should reject invalid templates', () => {
      expect(() => validateTemplate('invalid')).toThrow(CreateAppError)
      expect(() => validateTemplate('')).toThrow(CreateAppError)
      expect(() => validateTemplate('MINIMAL')).toThrow(CreateAppError)
    })
  })

  describe('validatePackageManager', () => {
    it('should accept valid package managers', () => {
      expect(() => validatePackageManager('npm')).not.toThrow()
      expect(() => validatePackageManager('pnpm')).not.toThrow()
      expect(() => validatePackageManager('yarn')).not.toThrow()
    })

    it('should reject invalid package managers', () => {
      expect(() => validatePackageManager('invalid')).toThrow(CreateAppError)
      expect(() => validatePackageManager('')).toThrow(CreateAppError)
      expect(() => validatePackageManager('NPM')).toThrow(CreateAppError)
    })
  })

  describe('validateEnvironment', () => {
    it('should pass with supported Node.js version', async () => {
      // Mock Node.js version
      const originalVersion = process.version
      Object.defineProperty(process, 'version', { value: 'v18.16.0' })
      
      mockedExeca.mockResolvedValue({ stdout: 'git version 2.40.0' } as any)
      
      await expect(validateEnvironment()).resolves.not.toThrow()
      
      // Restore original version
      Object.defineProperty(process, 'version', { value: originalVersion })
    })

    it('should throw error with unsupported Node.js version', async () => {
      const originalVersion = process.version
      Object.defineProperty(process, 'version', { value: 'v16.0.0' })
      
      await expect(validateEnvironment()).rejects.toThrow(CreateAppError)
      
      Object.defineProperty(process, 'version', { value: originalVersion })
    })

    it('should warn when git is not available', async () => {
      const originalVersion = process.version
      Object.defineProperty(process, 'version', { value: 'v18.16.0' })
      
      mockedExeca.mockRejectedValue(new Error('Command not found'))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await expect(validateEnvironment()).resolves.not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Git not found'))
      
      consoleSpy.mockRestore()
      Object.defineProperty(process, 'version', { value: originalVersion })
    })
  })

  describe('validateProjectPath', () => {
    it('should pass for valid writable path', async () => {
      mockedFs.access.mockResolvedValue(undefined)
      mockedFs.pathExists.mockResolvedValue(false)
      
      await expect(validateProjectPath('/valid/path')).resolves.not.toThrow()
    })

    it('should throw error for non-writable directory', async () => {
      mockedFs.access.mockRejectedValue(new Error('Permission denied'))
      
      await expect(validateProjectPath('/readonly/path')).rejects.toThrow(CreateAppError)
    })

    it('should throw error for non-empty directory', async () => {
      mockedFs.access.mockResolvedValue(undefined)
      mockedFs.pathExists.mockResolvedValue(true)
      mockedFs.readdir.mockResolvedValue(['file1.txt', 'file2.js'] as any)
      
      await expect(validateProjectPath('/existing/path')).rejects.toThrow(CreateAppError)
    })

    it('should allow directory with only safe hidden files', async () => {
      mockedFs.access.mockResolvedValue(undefined)
      mockedFs.pathExists.mockResolvedValue(true)
      mockedFs.readdir.mockResolvedValue(['.git', '.gitignore', '.DS_Store'] as any)
      
      await expect(validateProjectPath('/git/path')).resolves.not.toThrow()
    })
  })
})
