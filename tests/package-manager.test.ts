import { describe, it, expect, vi, beforeEach } from 'vitest'
import { execa } from 'execa'
import which from 'which'
import { detect } from 'detect-package-manager'
import { getPackageManagerInfo, validatePackageManagerVersion } from '../src/utils/package-manager'
import { CreateAppError } from '../src/utils/errors'

// Mock dependencies
vi.mock('execa')
vi.mock('which')
vi.mock('detect-package-manager')

const mockedExeca = vi.mocked(execa)
const mockedWhich = vi.mocked(which)
const mockedDetect = vi.mocked(detect)

describe('package-manager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPackageManagerInfo', () => {
    it('should return info for available package managers', async () => {
      mockedWhich.mockResolvedValue('/usr/bin/npm')
      
      const result = await getPackageManagerInfo('npm')
      
      expect(result.name).toBe('npm')
      expect(result.installCommand).toEqual(['install'])
      expect(result.runCommand('build')).toEqual(['run', 'build'])
      expect(result.isAvailable).toBe(true)
    })

    it('should auto-detect package manager when none specified', async () => {
      mockedWhich.mockResolvedValue('/usr/bin/pnpm')
      mockedDetect.mockResolvedValue('pnpm')
      
      const result = await getPackageManagerInfo()
      
      expect(result.name).toBe('pnpm')
      expect(result.isAvailable).toBe(true)
    })

    it('should throw error when no package manager is available', async () => {
      mockedWhich.mockRejectedValue(new Error('Command not found'))
      mockedDetect.mockRejectedValue(new Error('Detection failed'))
      
      await expect(getPackageManagerInfo()).rejects.toThrow(CreateAppError)
    })
  })

  describe('validatePackageManagerVersion', () => {
    it('should validate when package manager responds', async () => {
      mockedExeca.mockResolvedValue({ stdout: '10.2.3' } as any)
      
      await expect(validatePackageManagerVersion('npm')).resolves.not.toThrow()
      expect(mockedExeca).toHaveBeenCalledWith('npm', ['--version'], { stdio: 'pipe' })
    })

    it('should throw error when package manager command fails', async () => {
      mockedExeca.mockRejectedValue(new Error('Command not found'))
      
      await expect(validatePackageManagerVersion('npm')).rejects.toThrow(CreateAppError)
    })
  })
})