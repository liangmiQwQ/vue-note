# Contributing Guide

Thank you for your interest in contributing to vue-note! This guide will help you get started with development.

## Project Structure

This is a monorepo using pnpm workspaces:

- **Main package**: `packages/vue-note/` - Core compiler and Vite plugin
- **Playground**: `playground/` - Development playground for testing

## Development Setup

### Preparation

- Node.js latest LTS
- pnpm ([ni](https://github.com/antfu-collective/ni) recommended)

### Development Commands

```bash
# Build the project
pnpm build

# Build in watch mode
pnpm dev

# Run playground development server
pnpm play

# Run tests
pnpm test

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## Before Submitting PR

Ensure your changes pass:

- `pnpm build` - Build succeeds
- `pnpm test` - All tests pass
- `pnpm typecheck` - No TypeScript errors
- `pnpm lint` - Code style compliance

Your PR should pass the GitHub CI checks, which run these same commands.

## Contribution Guidelines

- It's best to submit an [issue](https://github.com/liangmiQwQ/vue-note/issues/new) for discussion if you want to make a new feature.
- If you encounter any issues during development or contributing, please check the [Design Philosophy](https://vue-note.liangmi.dev/extra/design-philosophy) documentation first. You can also reach me directly at [hi@liangmi.dev](mailto:hi@liangmi.dev).

## Thank You!

Your contributions are greatly appreciated! Whether you're fixing bugs, adding features, or improving documentation, every contribution helps make vue-note better for everyone.

If you have any questions or need help getting started, don't hesitate to reach out!
