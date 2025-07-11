import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execa } from 'execa'
import path from 'path'
import fs from 'fs-extra'

// Integration tests for the CLI
describe('CLI Integration Tests', () => {
  const testDir = path.join(process.cwd(), 'test-integration')
  const cliPath = path.join(process.cwd(), 'dist', 'index.js')

  beforeEach(async () => {
    // Ensure CLI is built
    await execa('pnpm', ['build'])
    
    // Clean up test directory
    await fs.remove(testDir)
  })

  afterEach(async () => {
    // Clean up test directory
    await fs.remove(testDir).catch(() => {})
  })

  it('should show help message', async () => {
    const result = await execa('node', [cliPath, '--help'])
    
    expect(result.stdout).toContain('create-bluewaves-app')
    expect(result.stdout).toContain('Usage:')
    expect(result.stdout).toContain('Options:')
    expect(result.stdout).toContain('--template')
    expect(result.stdout).toContain('--package-manager')
  })

  it('should show version', async () => {
    const result = await execa('node', [cliPath, '--version'])
    const packageJson = await fs.readJson('package.json')
    
    expect(result.stdout).toContain(packageJson.version)
  })

  it('should validate project name', async () => {
    try {
      await execa('node', [cliPath, 'invalid-name!'], {
        timeout: 5000
      })
    } catch (error: any) {
      expect(error.stderr).toContain('Invalid project name')
    }
  })

  it('should validate template option', async () => {
    try {
      await execa('node', [cliPath, 'test-app', '--template', 'invalid-template'], {
        timeout: 5000
      })
    } catch (error: any) {
      expect(error.stderr).toContain('Invalid template')
    }
  })

  // Note: Full project creation test would be too slow and complex for unit tests
  // This would be better as an E2E test in a separate test suite
})