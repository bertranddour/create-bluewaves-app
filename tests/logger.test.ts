import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, LogLevel } from '../src/utils/logger'

describe('logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>
    warn: ReturnType<typeof vi.spyOn>
    error: ReturnType<typeof vi.spyOn>
    debug: ReturnType<typeof vi.spyOn>
  }

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {})
    }
    logger.setLevel(LogLevel.DEBUG) // Enable all logs for testing
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('log levels', () => {
    it('should set and get log level', () => {
      logger.setLevel(LogLevel.ERROR)
      expect(logger.getLevel()).toBe(LogLevel.ERROR)
    })
  })

  describe('logging methods', () => {
    it('should log error messages', () => {
      logger.error('test error')
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        'test error'
      )
    })

    it('should log warning messages', () => {
      logger.warn('test warning')
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.any(String),
        'test warning'
      )
    })

    it('should log info messages', () => {
      logger.info('test info')
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        'test info'
      )
    })

    it('should log debug messages', () => {
      logger.debug('test debug')
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.any(String),
        'test debug'
      )
    })

    it('should log step messages', () => {
      logger.step('test step')
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        'test step'
      )
    })

    it('should log success messages', () => {
      logger.success('test success')
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        'test success'
      )
    })
  })

  describe('log level filtering', () => {
    it('should respect log levels', () => {
      logger.setLevel(LogLevel.ERROR)
      
      logger.debug('debug message')
      logger.info('info message')
      logger.warn('warn message')
      logger.error('error message')
      
      expect(consoleSpy.debug).not.toHaveBeenCalled()
      expect(consoleSpy.log).not.toHaveBeenCalled()
      expect(consoleSpy.warn).not.toHaveBeenCalled()
      expect(consoleSpy.error).toHaveBeenCalled()
    })
  })
})