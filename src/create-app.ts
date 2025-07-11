import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { CreateAppError, handleError } from './utils/errors'
import { validateProjectName, validateEnvironment, validateProjectPath, validateTemplate } from './utils/validation'
import { getPackageManagerInfo, validatePackageManagerVersion } from './utils/package-manager'
import { logger, LogLevel } from './utils/logger'
import { detect } from 'detect-package-manager'

interface CreateAppOptions {
  template?: string
  packageManager?: string
  skipInstall?: boolean
  skipGit?: boolean
  useNpm?: boolean
  usePnpm?: boolean
  useYarn?: boolean
  verbose?: boolean
}

export async function createBluewavesApp(projectName: string, options: CreateAppOptions) {
  try {
    // Set up logging
    if (options.verbose) {
      logger.setLevel(LogLevel.DEBUG)
    }

    // Validate environment
    await validateEnvironment()

    // Get project name if not provided
    if (!projectName) {
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is your project name?',
          default: 'my-bluewaves-app',
          validate: (input: string) => {
            try {
              validateProjectName(input)
              return true
            } catch (error) {
              return error instanceof CreateAppError ? error.message : 'Invalid project name'
            }
          }
        }
      ])
      projectName = name
    }

    // Validate project name
    validateProjectName(projectName)

    // Validate project path
    const projectPath = path.resolve(projectName)
    try {
      await validateProjectPath(projectPath)
    } catch (error) {
      if (error instanceof CreateAppError && error.code === 'DIRECTORY_NOT_EMPTY') {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `Directory ${projectName} already exists. Do you want to overwrite it?`,
            default: false
          }
        ])
        
        if (!overwrite) {
          logger.warn('Operation cancelled by user')
          process.exit(0)
        }
        
        logger.step('Removing existing directory...')
        await fs.remove(projectPath)
      } else {
        throw error
      }
    }

    // Get configuration
    const config = await getProjectConfiguration(options)
    
    // Validate configuration
    validateTemplate(config.template)
    const packageManagerInfo = await getPackageManagerInfo(config.packageManager)
    await validatePackageManagerVersion(packageManagerInfo.name)
  
    console.log()
    console.log(chalk.blue('🏄‍♂️ Creating your Bluewaves app...'))
    console.log(chalk.gray(`Project: ${projectName}`))
    console.log(chalk.gray(`Template: ${config.template}`))
    console.log(chalk.gray(`Package Manager: ${config.packageManager}`))
    console.log()

    const startTime = Date.now()
    const spinner = ora('Setting up project...').start()

    try {
      // Step 1: Create Next.js app
      spinner.text = '🚀 Creating Next.js application...'
      await createNextJsApp(projectName, config, spinner)

      // Step 2: Setup shadcn/ui
      spinner.text = '🎨 Installing shadcn/ui...'
      await setupShadcnUI(projectPath, config, spinner)

      // Step 3: Install Surfer design system
      spinner.text = '🏄‍♂️ Installing Surfer design system...'
      await installSurferDesignSystem(projectPath, config, spinner)

      // Step 4: Setup project template
      spinner.text = `📄 Setting up ${config.template} template...`
      await setupProjectTemplate(projectPath, config, spinner)

      // Step 5: Install dependencies
      if (!config.skipInstall) {
        spinner.text = '📦 Installing dependencies...'
        await installDependencies(projectPath, config, spinner)
      }

      // Step 6: Initialize git
      if (!config.skipGit) {
        spinner.text = '📝 Initializing git repository...'
        await initializeGit(projectPath, config, spinner)
      }

      // Step 7: Final setup
      spinner.text = '✨ Final touches...'
      await finalSetup(projectPath, config, spinner)

      const duration = ((Date.now() - startTime) / 1000).toFixed(1)
      spinner.succeed(`🎉 Created ${projectName} in ${duration}s`)

      // Success message
      printSuccessMessage(projectName, config)

    } catch (error) {
      if (spinner) {
        spinner.fail('Failed to create Bluewaves app')
      }
      throw error
    }
  } catch (error) {
    handleError(error, options.verbose)
    process.exit(1)
  }
}

async function getProjectConfiguration(options: CreateAppOptions) {
  const questions = []

  // Template selection
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: '🚀 Minimal - Clean setup with core components', value: 'minimal' },
        { name: '📊 Dashboard - Admin interface with charts and tables', value: 'dashboard' },
        { name: '💼 SaaS - Complete SaaS application template', value: 'saas' },
        { name: '🛍️ E-commerce - Online store with product management', value: 'ecommerce' },
        { name: '🎯 Landing Page - Marketing site with conversion focus', value: 'landing' }
      ],
      default: 'minimal'
    })
  }

  // Package manager selection
  if (!options.packageManager && !options.useNpm && !options.usePnpm && !options.useYarn) {
    const detected = await detect().catch(() => 'pnpm')
    questions.push({
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'pnpm (recommended)', value: 'pnpm' },
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' }
      ],
      default: detected || 'pnpm'
    })
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions as any) : {}

  return {
    template: options.template || answers.template || 'minimal',
    packageManager: options.packageManager || 
                   (options.useNpm ? 'npm' : options.usePnpm ? 'pnpm' : options.useYarn ? 'yarn' : answers.packageManager || 'pnpm'),
    skipInstall: options.skipInstall || false,
    skipGit: options.skipGit || false,
    verbose: options.verbose || false
  }
}

async function createNextJsApp(projectName: string, config: any, _spinner: any) {
  // Use create-next-app with latest version and optimal settings
  const createNextCommand = [
    'create-next-app@latest',
    projectName,
    '--typescript',
    '--tailwind',
    '--eslint',
    '--app',
    '--src-dir',
    '--import-alias', '@/*'
  ]

  await execa('npx', createNextCommand, {
    stdio: config.verbose ? 'inherit' : 'pipe'
  })
}

async function setupShadcnUI(projectPath: string, config: any, _spinner: any) {
  const cwd = projectPath

  // Initialize shadcn/ui
  await execa('npx', ['shadcn@latest', 'init', '--yes', '--style', 'new-york'], {
    cwd,
    stdio: config.verbose ? 'inherit' : 'pipe'
  })

  // Install core shadcn/ui components
  const coreComponents = [
    'button',
    'card',
    'input',
    'label',
    'badge',
    'avatar',
    'dropdown-menu',
    'navigation-menu',
    'sheet',
    'toast',
    'dialog',
    'select',
    'switch',
    'tabs',
    'tooltip',
    'accordion',
    'alert',
    'checkbox',
    'form',
    'popover',
    'progress',
    'radio-group',
    'separator',
    'slider',
    'table',
    'textarea'
  ]

  // Install components in batches to avoid overwhelming the CLI
  const batchSize = 5
  for (let i = 0; i < coreComponents.length; i += batchSize) {
    const batch = coreComponents.slice(i, i + batchSize)
    await execa('npx', ['shadcn@latest', 'add', ...batch, '--yes'], {
      cwd,
      stdio: config.verbose ? 'inherit' : 'pipe'
    })
  }
}

async function installSurferDesignSystem(projectPath: string, config: any, _spinner: any) {
  const cwd = projectPath

  // Add Surfer design system to package.json
  const packageJsonPath = path.join(cwd, 'package.json')
  const packageJson = await fs.readJson(packageJsonPath)

  packageJson.dependencies = {
    ...packageJson.dependencies,
    '@bluewaves/surfer': '^1.0.0',
    'framer-motion': '^11.0.0',
    'next-themes': '^0.4.6',
    'sonner': '^2.0.6',
    'zod': '^4.0.5'
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })

  // Update Tailwind config to use Surfer preset
  const tailwindConfigPath = path.join(cwd, 'tailwind.config.ts')
  const surferTailwindConfig = `import type { Config } from 'tailwindcss'
import { surferPreset } from '@bluewaves/surfer/tailwind'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@bluewaves/surfer/**/*.{js,ts,jsx,tsx}'
  ],
  presets: [surferPreset],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        heading: ['var(--font-heading)']
      }
    }
  }
}

export default config`

  await fs.writeFile(tailwindConfigPath, surferTailwindConfig)

  // Update globals.css to import Surfer styles
  const globalsCssPath = path.join(cwd, 'src/app/globals.css')
  const surferGlobalsCss = `@import '@bluewaves/surfer/css';
@import 'tailwindcss';

/* Your custom styles here */`

  await fs.writeFile(globalsCssPath, surferGlobalsCss)

  // Create surfer.config.json
  const surferConfig = {
    version: '1.0.0',
    template: config.template,
    nextjs: {
      version: '15.x',
      appRouter: true
    },
    customizations: {
      colors: {},
      fonts: {},
      components: {}
    }
  }

  await fs.writeJson(path.join(cwd, 'surfer.config.json'), surferConfig, { spaces: 2 })
}

async function setupProjectTemplate(projectPath: string, config: any, _spinner: any) {
  const templatePath = path.join(__dirname, '..', 'templates', config.template)
  const cwd = projectPath

  // Copy template files if they exist
  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, path.join(cwd, 'src'))
  } else {
    // Create basic template
    await createBasicTemplate(cwd, config.template)
  }
}

async function createBasicTemplate(projectPath: string, template: string) {
  const appPath = path.join(projectPath, 'src/app')

  // Create enhanced page.tsx based on template
  const pageContent = getTemplatePageContent(template)
  await fs.writeFile(path.join(appPath, 'page.tsx'), pageContent)

  // Create layout.tsx with fonts and theme provider
  const layoutContent = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Bluewaves App',
  description: 'Built with Surfer design system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}`

  await fs.writeFile(path.join(appPath, 'layout.tsx'), layoutContent)
}

function getTemplatePageContent(template: string): string {
  const baseContent = `import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="surfer-container surfer-section">
      <div className="surfer-hero">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to your{' '}
            <span className="surfer-gradient-text">${template}</span> app 🏄‍♂️
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Built with Next.js, Surfer design system, and shadcn/ui. Ready to ship.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="surfer-section">
        <div className="surfer-feature-grid">
          ${getTemplateCards(template)}
        </div>
      </div>
    </div>
  )
}`

  return baseContent
}

function getTemplateCards(template: string): string {
  const cards = {
    minimal: `
          <Card>
            <CardHeader>
              <CardTitle>🚀 Next.js 15</CardTitle>
              <CardDescription>Latest Next.js with App Router</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Server Components, optimized bundling, and perfect performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 Surfer Design System</CardTitle>
              <CardDescription>S-tier design system ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                OKLCH colors, enhanced components, and performance-first architecture.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧩 shadcn/ui</CardTitle>
              <CardDescription>Complete component library installed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                25+ components ready to use with full customization control.
              </p>
            </CardContent>
          </Card>`,
    
    dashboard: `
          <Card>
            <CardHeader>
              <CardTitle>📊 Dashboard Ready</CardTitle>
              <CardDescription>Admin interface components</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tables, charts, forms, and navigation - everything you need.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Data Visualization</CardTitle>
              <CardDescription>Beautiful charts and graphs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recharts integration with responsive design and dark mode.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication</CardTitle>
              <CardDescription>User management built-in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Login, signup, and protected routes with modern auth patterns.
              </p>
            </CardContent>
          </Card>`,

    saas: `
          <Card>
            <CardHeader>
              <CardTitle>💼 SaaS Ready</CardTitle>
              <CardDescription>Complete SaaS application structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Billing, subscriptions, user management, and admin dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💳 Payments</CardTitle>
              <CardDescription>Stripe integration ready</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Subscription management, billing portal, and payment flows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📧 Email & Notifications</CardTitle>
              <CardDescription>Communication system built-in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transactional emails, in-app notifications, and user onboarding.
              </p>
            </CardContent>
          </Card>`
  }

  return cards[template as keyof typeof cards] || cards.minimal
}

async function installDependencies(projectPath: string, config: any, _spinner: any) {
  await execa(config.packageManager, ['install'], {
    cwd: projectPath,
    stdio: config.verbose ? 'inherit' : 'pipe'
  })
}

async function initializeGit(projectPath: string, config: any, _spinner: any) {
  try {
    await execa('git', ['init'], { cwd: projectPath })
    await execa('git', ['add', '.'], { cwd: projectPath })
    await execa('git', ['commit', '-m', '🌊 Initial commit: Bluewaves app with Surfer design system'], { 
      cwd: projectPath 
    })
  } catch (error) {
    // Git initialization is optional
    if (config.verbose) {
      console.warn('Git initialization failed:', error)
    }
  }
}

async function finalSetup(projectPath: string, config: any, _spinner: any) {
  // Create a README with next steps
  const readmeContent = `# ${path.basename(projectPath)}

Welcome to your Bluewaves app! 🏄‍♂️

This project was created with \`create-bluewaves-app\` and includes:

- **Next.js 15** with App Router and TypeScript
- **Surfer Design System** - S-tier design system with OKLCH colors
- **shadcn/ui** - Complete component library (25+ components installed)
- **Tailwind CSS v4** - Latest version with performance optimizations
- **Framer Motion** - Smooth animations
- **Next Themes** - Dark mode support

## 🚀 Getting Started

\`\`\`bash
# Start development server
${config.packageManager} dev

# Build for production
${config.packageManager} build

# Start production server
${config.packageManager} start
\`\`\`

## 📚 Documentation

- [Surfer Design System](https://surfer.bluewaves.ai)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎨 Customization

### Colors
Edit \`surfer.config.json\` to customize your design tokens.

### Components
All shadcn/ui components are in \`src/components/ui/\` - customize as needed.

### Styling
Global styles are in \`src/app/globals.css\` with Surfer design system.

## 🏄‍♂️ Surfer Commands

\`\`\`bash
# Add more components
npx surfer add data-table
npx surfer add marketing-hero

# Generate custom components
npx surfer generate component UserProfile

# Analyze performance
npx surfer analyze --performance
\`\`\`

## 🌊 Happy Surfing!

Built with ❤️ by [Bluewaves](https://bluewaves.ai)
`

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent)
}

function printSuccessMessage(projectName: string, config: any) {
  console.log()
  console.log(chalk.green.bold('🎉 Success! Your Bluewaves app is ready to surf!'))
  console.log()
  console.log(chalk.blue('📁 Project created with:'))
  console.log(chalk.gray(`   ✓ Next.js 15 with App Router`))
  console.log(chalk.gray(`   ✓ Surfer Design System`))
  console.log(chalk.gray(`   ✓ shadcn/ui (25+ components)`))
  console.log(chalk.gray(`   ✓ Tailwind CSS v4`))
  console.log(chalk.gray(`   ✓ TypeScript & ESLint`))
  console.log(chalk.gray(`   ✓ ${config.template} template`))
  console.log()
  console.log(chalk.blue('🚀 Next steps:'))
  console.log()
  console.log(chalk.white(`   cd ${projectName}`))
  console.log(chalk.white(`   ${config.packageManager} dev`))
  console.log()
  console.log(chalk.blue('🏄‍♂️ Surfer commands:'))
  console.log(chalk.gray('   npx surfer add data-table     # Add components'))
  console.log(chalk.gray('   npx surfer generate component # Create components'))
  console.log(chalk.gray('   npx surfer analyze            # Performance analysis'))
  console.log()
  console.log(chalk.blue('📚 Documentation:'))
  console.log(chalk.gray('   https://surfer.bluewaves.ai'))
  console.log()
  console.log(chalk.cyan('Happy surfing! 🌊'))
}