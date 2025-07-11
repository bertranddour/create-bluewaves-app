# Contributing to create-bluewaves-app

Thank you for considering contributing to create-bluewaves-app! We welcome contributions of all kinds.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bluewaves/create-bluewaves-app.git
   cd create-bluewaves-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

## Development Workflow

1. **Development mode**
   ```bash
   pnpm dev
   ```

2. **Type checking**
   ```bash
   pnpm typecheck
   ```

3. **Linting**
   ```bash
   pnpm lint
   pnpm lint:fix
   ```

4. **Testing with coverage**
   ```bash
   pnpm test:coverage
   ```

## Testing the CLI

To test the CLI locally:

```bash
# Build the project
pnpm build

# Test with a local project
node dist/index.js my-test-app --template minimal --verbose
```

## Project Structure

- `src/` - Source code
  - `index.ts` - CLI entry point
  - `create-app.ts` - Main application logic
  - `utils/` - Utility functions
- `tests/` - Test files
- `templates/` - Project templates
- `dist/` - Built output

## Guidelines

### Code Style
- Use TypeScript
- Follow the existing code style
- Use Prettier for formatting
- Use ESLint for linting

### Testing
- Write tests for new features
- Maintain test coverage above 80%
- Use Vitest for testing

### Commits
- Use conventional commit messages
- Keep commits focused and atomic
- Write clear commit messages

### Pull Requests
- Create feature branches from `main`
- Write clear PR descriptions
- Include tests for new features
- Ensure CI passes

## Adding New Templates

1. Create a new directory in `templates/`
2. Add the template files
3. Update the template validation in `src/utils/validation.ts`
4. Add template-specific logic in `src/create-app.ts`
5. Write tests for the new template

## Release Process

Releases are automated through GitHub Actions:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a new tag: `git tag v1.x.x`
4. Push the tag: `git push origin v1.x.x`

## Reporting Issues

- Use the GitHub issue tracker
- Provide clear reproduction steps
- Include environment information
- Add relevant logs/screenshots

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.