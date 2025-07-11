# create-bluewaves-app 🌊

**The S-tier way to create Next.js applications**

Create a new Next.js app with Surfer design system + shadcn/ui + everything configured in one command.

## 🚀 Quick Start

```bash
# Create a new Bluewaves app
npx create-bluewaves-app@latest my-awesome-app

# Or with template selection
npx create-bluewaves-app@latest my-dashboard --template dashboard
```

That's it! Your app is ready with:

- ✅ **Next.js 15** with App Router and TypeScript
- ✅ **Surfer Design System** with OKLCH colors and performance optimizations
- ✅ **shadcn/ui** with 25+ components pre-installed
- ✅ **Tailwind CSS v4** with latest performance features
- ✅ **Framer Motion** for smooth animations
- ✅ **Next Themes** for dark mode support
- ✅ **ESLint & TypeScript** configured
- ✅ **Git repository** initialized

## 🎨 Templates

Choose from our curated templates:

### 🚀 Minimal

Clean setup with core components - perfect for starting fresh.

```bash
npx create-bluewaves-app@latest my-app --template minimal
```

### 📊 Dashboard

Admin interface with charts, tables, and metrics.

```bash
npx create-bluewaves-app@latest my-dashboard --template dashboard
```

### 💼 SaaS

Complete SaaS application with billing, auth, and user management.

```bash
npx create-bluewaves-app@latest my-saas --template saas
```

### 🛍️ E-commerce

Online store with product management and shopping cart.

```bash
npx create-bluewaves-app@latest my-store --template ecommerce
```

### 🎯 Landing Page

Marketing site optimized for conversions.

```bash
npx create-bluewaves-app@latest my-landing --template landing
```

## 🛠️ Command Options

```bash
npx create-bluewaves-app@latest [project-name] [options]
```

### Options

| Option                       | Description                       | Default       |
| ---------------------------- | --------------------------------- | ------------- |
| `-t, --template <template>`  | Template to use                   | `minimal`     |
| `-p, --package-manager <pm>` | Package manager (npm, pnpm, yarn) | Auto-detected |
| `--use-npm`                  | Use npm                           |               |
| `--use-pnpm`                 | Use pnpm                          |               |
| `--use-yarn`                 | Use yarn                          |               |
| `--skip-install`             | Skip package installation         |               |
| `--skip-git`                 | Skip git initialization           |               |
| `--verbose`                  | Enable verbose logging            |               |

### Examples

```bash
# Create with specific template and package manager
npx create-bluewaves-app@latest my-app --template dashboard --use-pnpm

# Create without installing dependencies
npx create-bluewaves-app@latest my-app --skip-install

# Create with verbose output
npx create-bluewaves-app@latest my-app --verbose
```

## 🏗️ What Gets Created

### Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── globals.css          # Surfer design system styles
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── page.tsx             # Homepage with template content
│   └── components/
│       └── ui/                  # shadcn/ui components (25+ installed)
├── surfer.config.json           # Surfer configuration
├── tailwind.config.ts           # Tailwind with Surfer preset
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

### Dependencies Installed

#### Core Framework

- `next` - Next.js 15 with App Router
- `react` & `react-dom` - React 19
- `typescript` - TypeScript support

#### Design System

- `@bluewaves/surfer` - Surfer design system
- `tailwindcss` - Tailwind CSS v4
- `@tailwindcss/postcss` - PostCSS plugin

#### UI Components

- All shadcn/ui Radix dependencies
- `lucide-react` - Icon library
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - Utility functions

#### Enhanced Features

- `framer-motion` - Animations
- `next-themes` - Theme switching
- `sonner` - Toast notifications
- `zod` - Schema validation

## 🎯 After Creation

### Start Development

```bash
cd my-app
npm run dev        # or pnpm dev / yarn dev
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Surfer Commands

```bash
# Add more components
npx surfer add data-table
npx surfer add marketing-hero

# Generate custom components
npx surfer generate component UserProfile

# Analyze performance
npx surfer analyze --performance
```

## 🎨 Customization

### Design Tokens

Edit `surfer.config.json` to customize:

```json
{
  "version": "1.0.0",
  "template": "minimal",
  "customizations": {
    "colors": {
      "primary": "oklch(0.7871 0.1341 203.37)"
    },
    "fonts": {
      "heading": "Inter"
    }
  }
}
```

### Components

All shadcn/ui components are in `src/components/ui/` - modify as needed.

### Styling

Global styles in `src/app/globals.css` with Surfer design system variables.

## 🚀 Performance

Your app is created with performance in mind:

- **Bundle Size**: Optimized with tree-shaking
- **Core Web Vitals**: Perfect scores out of the box
- **CSS**: Zero runtime overhead with CSS-in-CSS
- **Images**: Next.js Image optimization enabled
- **Fonts**: Optimized font loading

## 🔧 Requirements

- **Node.js**: 18.0.0 or higher
- **Package Manager**: npm, pnpm, or yarn

## 🌟 Why create-bluewaves-app?

### vs create-next-app

- ✅ Complete design system included
- ✅ 25+ UI components pre-installed
- ✅ Performance optimized out of the box
- ✅ Templates for different use cases
- ✅ Dark mode configured
- ✅ Animations included

### vs Manual Setup

- ✅ Saves hours of configuration
- ✅ Best practices built-in
- ✅ No decision fatigue
- ✅ Tested combinations
- ✅ Ready to ship

### vs Other Starters

- ✅ Framework-specific optimizations
- ✅ S-tier design system
- ✅ Component ownership
- ✅ Modern tech stack
- ✅ Continuous updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - feel free to use in your projects.

## 🆘 Support

- 📖 [Documentation](https://surfer.bluewaves.ai)
- 🐛 [Issues](https://github.com/bluewaves/create-bluewaves-app/issues)
- 💬 [Discussions](https://github.com/bluewaves/create-bluewaves-app/discussions)
- 📧 [Email](mailto:support@bluewaves.ai)

## 🌊 About Bluewaves

create-bluewaves-app is built by [Bluewaves](https://bluewaves.ai) - we create tools that help developers build better applications faster.

---

**Start surfing with style! 🏄‍♂️**
