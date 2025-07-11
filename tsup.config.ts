import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  target: 'node18',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    'fs-extra',
    'inquirer',
    'chalk',
    'ora',
    'execa',
    'commander',
    'validate-npm-package-name',
    'detect-package-manager',
    'semver',
    'cross-spawn',
    'which',
  ],
})
