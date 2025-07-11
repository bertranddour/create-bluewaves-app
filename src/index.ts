import { program } from 'commander'
import chalk from 'chalk'
import { createBluewavesApp } from './create-app'

const packageJson = require('../package.json')

console.log()
console.log(chalk.blue.bold('🌊 Welcome to create-bluewaves-app'))
console.log(chalk.gray('The S-tier way to create Next.js apps with Surfer design system'))
console.log()

program
  .name('create-bluewaves-app')
  .description('🌊 Create a new Bluewaves app with Next.js + Surfer design system + shadcn/ui')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of your project')
  .option(
    '-t, --template <template>',
    'Template to use (minimal, dashboard, saas, ecommerce, landing)',
    'minimal'
  )
  .option('-p, --package-manager <pm>', 'Package manager to use (npm, pnpm, yarn)')
  .option('--skip-install', 'Skip package installation')
  .option('--skip-git', 'Skip git repository initialization')
  .option('--use-npm', 'Use npm (shorthand for --package-manager npm)')
  .option('--use-pnpm', 'Use pnpm (shorthand for --package-manager pnpm)')
  .option('--use-yarn', 'Use yarn (shorthand for --package-manager yarn)')
  .option('--verbose', 'Enable verbose logging')
  .action(async (projectName, options) => {
    try {
      await createBluewavesApp(projectName, options)
    } catch (error) {
      console.error(chalk.red('❌ Failed to create Bluewaves app:'))
      console.error(error)
      process.exit(1)
    }
  })

program.parse()

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
