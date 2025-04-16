# Development Guide

This guide provides instructions for setting up a development environment for the Reward Service project, along with best practices and workflow recommendations.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://docs.docker.com/get-started/get-docker/) installed

---

## Getting Started

### 1. Clone the Repository

```bash
git clone {url}
cd reward-service
```

### 2. Environment Setup

Create and configure `.env` file based on the example:

```bash
cp .env.example .env
```

Edit the `.env` file to configure:
- Database credentials
- Redis connection
- Blockchain RPC endpoints
- Wallet information

### 3. Start Development Environment

```bash
docker compose -f docker-compose.dev.yml up
```

This will start all required services:
- PostgreSQL database
- Redis cache and queue
- Database migrations
- All microservices in development mode with hot reloading


> **Note:** You can run services independently for focused development

```bash
# Start specific service in development mode
pnpm run start:dev {app-name}
```

---

## Project Structure

The project follows a monorepo structure using NestJS workspaces:

```
reward-service/
├── apps/                          # Application services
│   ├── evm-listener/
│   ├── event-processor-scheduler/
│   └── evm-transaction-processor/
├── libs/                          # Shared libraries
│   ├── blockchains/
│   ├── database/
│   └── shared/
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Libraries

- **blockchains**: Contains blockchain interaction abstractions and implementations
- **database**: Contains database entities, migrations, and services
- **shared**: Contains common utilities, types, and configurations

### Applications

- **evm-listener**: Monitors EVM blockchains for events
- **event-processor-scheduler**: Processes events and schedules reward claiming
- **evm-transaction-processor**: Executes EVM blockchain transactions

---

## Database Management

#### TypeORM CLI Commands

```bash
# Generate a new migration
pnpm run migration:generate libs/database/src/migrations/{migration-name}

# Create an empty migration
pnpm run migration:create libs/database/src/migrations/{migration-name}

# Run migrations
pnpm run migration:run

# Revert the last migration
pnpm run migration:revert
```

#### Adding a New Database Entity

1. Create the entity class in `libs/database/src/entities`
2. Register the entity in `libs/database/src/database.module.ts`
3. Generate a migration: `pnpm run migration:generate libs/database/src/migrations/{migration-name}`

---

## Adding a New Blockchain Listener

### 1. Implement a New Blockchain Listener Class

Create a new class that extends the `BlockchainListener` base class to handle blockchain-specific event detection and processing.

- **Location**: `libs/blockchains/src/<chain-name>/<chain-name>-listener.ts` (e.g., `libs/blockchains/src/bitcoin/bitcoin-listener.ts`)

**Example**:

```ts
// libs/blockchains/src/bitcoin/bitcoin-listener.ts
import { BlockchainListener } from '../blockchain-listener';

export class BitcoinListener extends BlockchainListener {
  /**
   * Retrieves the current block number
   *
   * @returns {Promise<number>} The current block number
   */
  async getCurrentBlockNumber(): Promise<number> {
    //
  }

  // ...
}
```

### 2. Create Blockchain-Specific Configuration

Define the network configuration for the new blockchain, including RPC URLs and other settings.

- **Location**: libs/shared/src/configs/network.ts
- **Action**: Add an entry to the networks object.

**Example**:

```ts
// libs/shared/src/configs/network.ts

export const networks = {
  // ...

  [NetworkName.BITCOIN]: {
    name: NetworkName.BITCOIN,
    type: 'utxo',
    rpcUrl: `https://bitcoin-rpc-url.com`,
  },

  // ...
}
```

### 3. Generate a New App for the Chain Listener

Use the NestJS CLI to generate a new application for the blockchain listener. This creates a new app under the `apps` folder, making it a peer to other listener apps.

```bash
# e.g bitcoin-listener
pnpm nest generate app <chain-name>-listener
```

**What This Does:**

- Creates a new NestJS app in `apps/<chain-name>-listener` (e.g., apps/bitcoin-listener).
- Adds a project-specific tsconfig.app.json for TypeScript configuration.

### 4. Configure Docker Compose

Add the new app as a service in Docker Compose for deployment

- Add a new service entry for the blockchain listener app.
- Specify dependencies on shared services (e.g., Redis, PostgreSQL).
- Map ports and set environment variables as required.

**Example Configuration:**

```yaml
services:
  bitcoin-listener:
    build:
      context: .
      target: development
    env_file:
      - .env
    environment:
      - APP_NAME=bitcoin-listener
      - PORT=3003
    command: ["pnpm", "run", "start:dev", "bitcoin-listener"]
    volumes:
      - ./apps/bitcoin-listener:/app/apps/bitcoin-listener
      - ./libs:/app/libs
    depends_on:
      - redis
      - postgres
      - migration
    ports:
      - "3003:3000"
    networks:
      - app-net
```


### Logging

The application uses Pino for structured logging. In development, logs are output to the console with pretty formatting. You can adjust log levels in the configuration.
