# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Build the CLI
pnpm build

# Development with watch mode
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format

# Prepare for publishing
pnpm prepublishOnly
```

## Architecture Overview

This is a CLI tool called `create-bluewaves-app` that scaffolds Next.js applications with the Bluewaves Surfer design system and shadcn/ui components.

### Core Structure

- **src/index.ts**: Entry point and CLI setup using Commander.js
- **src/create-app.ts**: Main application creation logic with step-by-step setup
- **templates/**: Template files for different app types (dashboard, saas, etc.)
- **tsup.config.ts**: Build configuration for CLI distribution

### Key Workflow

1. **CLI Parsing**: Uses Commander.js to handle command line arguments and options
2. **Project Configuration**: Interactive prompts using inquirer for template and package manager selection
3. **Multi-step Setup**:
   - Creates Next.js app using create-next-app
   - Installs and configures shadcn/ui components (25+ components in batches)
   - Integrates Surfer design system with Tailwind preset
   - Applies template-specific configurations
   - Installs dependencies and initializes git

### Template System

Templates are organized by use case:

- **minimal**: Basic setup with core components
- **dashboard**: Admin interface with charts and tables
- **saas**: Complete SaaS application structure
- **ecommerce**: Online store components
- **landing**: Marketing page optimizations

### External Integrations

- **create-next-app**: For Next.js project scaffolding
- **shadcn/ui**: Component library initialization and installation
- **Surfer Design System**: Custom Tailwind preset and styling system
- **Package Manager Detection**: Auto-detects npm/pnpm/yarn

### Build System

Uses tsup for CLI bundling with:

- CommonJS output for Node.js compatibility
- Shebang banner for executable permissions
- External dependencies to keep bundle size minimal
- Node 18+ target compatibility

## Important Notes

- Components are installed in batches of 5 to avoid CLI overflow
- Git initialization is optional and gracefully handles failures
- Package manager is auto-detected but can be overridden
- Templates can be extended by adding new directories under templates/
- All file operations use fs-extra for enhanced error handling
