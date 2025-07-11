import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateProjectName, validateTemplate } from '../src/utils/validation'
import { CreateAppError } from '../src/utils/errors'
import { getPackageManagerRunner } from '../src/create-app'

// Mock external dependencies that getPackageManagerRunner uses
vi.mock('execa')

describe('create-app core logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('project name validation', () => {
    it('should accept valid project names', () => {
      expect(() => validateProjectName('my-app')).not.toThrow()
      expect(() => validateProjectName('test-project-123')).not.toThrow()
    })

    it('should reject invalid project names', () => {
      expect(() => validateProjectName('invalid!')).toThrow(CreateAppError)
      expect(() => validateProjectName('')).toThrow(CreateAppError)
    })
  })

  describe('template validation', () => {
    it('should accept valid templates', () => {
      expect(() => validateTemplate('minimal')).not.toThrow()
      expect(() => validateTemplate('dashboard')).not.toThrow()
      expect(() => validateTemplate('saas')).not.toThrow()
    })

    it('should reject invalid templates', () => {
      expect(() => validateTemplate('invalid')).toThrow(CreateAppError)
      expect(() => validateTemplate('')).toThrow(CreateAppError)
    })
  })

  describe('getPackageManagerRunner', () => {
    it('should return correct runner for npm', () => {
      const result = getPackageManagerRunner('npm')
      expect(result).toEqual({ command: 'npx', args: [] })
    })

    it('should return correct runner for pnpm', () => {
      const result = getPackageManagerRunner('pnpm')
      expect(result).toEqual({ command: 'pnpm', args: ['dlx'] })
    })

    it('should return correct runner for yarn', () => {
      const result = getPackageManagerRunner('yarn')
      expect(result).toEqual({ command: 'yarn', args: ['dlx'] })
    })

    it('should return correct runner for bun', () => {
      const result = getPackageManagerRunner('bun')
      expect(result).toEqual({ command: 'bunx', args: ['--bun'] })
    })

    it('should default to npx for unknown package managers', () => {
      const result = getPackageManagerRunner('unknown')
      expect(result).toEqual({ command: 'npx', args: [] })
    })
  })
})