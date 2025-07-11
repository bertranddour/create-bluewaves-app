import { describe, it, expect, vi } from 'vitest'
import { CreateAppError, handleError } from '../src/utils/errors'

describe('errors', () => {
  describe('CreateAppError', () => {
    it('should create error with message and code', () => {
      const error = new CreateAppError('Test message', 'TEST_CODE')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error.name).toBe('CreateAppError')
    })

    it('should create error with cause', () => {
      const cause = new Error('Original error')
      const error = new CreateAppError('Test message', 'TEST_CODE', cause)
      expect(error.cause).toBe(cause)
    })
  })

  describe('handleError', () => {
    it('should handle CreateAppError', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new CreateAppError('Test message', 'TEST_CODE')

      handleError(error)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Test message'))
      consoleSpy.mockRestore()
    })

    it('should handle generic Error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Generic error')

      handleError(error)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ An unexpected error occurred:')
      )
      consoleSpy.mockRestore()
    })

    it('should handle unknown error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      handleError('String error')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ An unknown error occurred')
      )
      consoleSpy.mockRestore()
    })
  })
})
