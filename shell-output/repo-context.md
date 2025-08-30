# Repository Context Summary for ChatGPT

## 1. Project Goal & State

This repository contains a TypeScript-based global CLI tool for interacting with the OwnerRez v2.0 API. The goal is to build a comprehensive command-line interface to manage all aspects of a short-term rental business.

The project is actively in development. Core command structures have been established, and several key API resources have been implemented.

## 2. Repository Structure Highlights

- `src/api/ownerrez-client.ts`: The core client for making authenticated requests to the OwnerRez API. It uses `axios`.
- `src/cli/index.ts`: The main entry point for the CLI, using the `commander` library to define commands.
- `src/cli/commands/`: Contains the implementation for each high-level command (e.g., `bookings`, `properties`). Each file defines a class that adds subcommands (`list`, `get`, `create`, `update`) to the main `program` object.
- `src/utils/config.ts` & `config-loader.ts`: Utilities for loading configuration and API credentials from a `.env` file.
- `docs/api/ownerrez-api-v2.0.md`: The primary source of truth for available API endpoints.
- `package.json`: Defines dependencies and build scripts.

## 3. Current Progress

### Implemented Commands

The following resources have been implemented with full `list`, `get`, `create`, and `update` subcommands:

- `properties`: List, get, create, and update properties.
- `bookings`: List, get, create, and update bookings.
- `guests`: List, get, create, and update guests.
- `quotes`: List, get, create, and update quotes.

### Dependencies

- **Runtime**: `commander`, `axios`, `dotenv`
- **Development**: `typescript`, `@types/node`

### Setup

1.  Run `npm install`.
2.  Create a `.env` file with `OWNERREZ_API_USER` and `OWNERREZ_API_TOKEN`.
3.  Build the project with `npm run build:cli`.
4.  Run the tool via `node dist/cli/index.js <command>`.

## 4. Gaps, Blockers & Next Steps

### Missing Functionality

- **DELETE Operations**: No `delete` subcommands have been implemented for any of the resources. This is a major gap for full CRUD functionality.
- **Incomplete API Coverage**: The API documentation (`ownerrez-api-v2.0.md`) lists many resources that are not yet implemented in the CLI. The next logical resources to implement would be:
  - `Owners`
  - `Tags` / `TagDefinitions`
  - `FieldDefinitions` / `Fields`
  - `Inquiries`
  - `Messages`

### TODOs & Placeholders

- The `guests.ts` file was recently refactored from a conflicting `yargs` implementation to match the project's `commander` standard. While functional, it should be reviewed for any inconsistencies.
- Error handling is basic, typically logging the error message to the console. A more robust error handling strategy could be implemented.

### Blockers

- There are no immediate blockers. The foundation is solid for extending the CLI to cover the rest of the OwnerRez API.