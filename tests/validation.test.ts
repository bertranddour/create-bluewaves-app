import { describe, it, expect } from 'vitest'
import { validateProjectName, validateTemplate, validatePackageManager } from '../src/utils/validation'
import { CreateAppError } from '../src/utils/errors'

describe('validation', () => {
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
})