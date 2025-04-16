# Reward Service

The **Reward Service** is a part of the [Train protocol](https://github.com/TrainProtocol), designed to detect swaps with rewards and execute redeem transactions to claim the reward. It monitors blockchain networks for specific events (e.g., funds locked or redeemed), tracks reward timelocks, and submits transactions to claim rewards once conditions are met.

---

## Features

- **Multi-Chain Support**: Currently monitors EVM-based chains (Ethereum, Optimism, Arbitrum) with extendable architecture for other chains.
- **Event-Driven Processing**: Detects and processes HTLC events using a centralized queue.
- **Reward Scheduling**: Automatically schedules reward claims based on configured reward timelocks.
- **Fault Tolerance**: Implements retries, error handling, and persistent state management.
- **Scalability**: Microservices architecture allows independent scaling of listeners and processors.
- **Transaction Tracking**: Maintains a detailed history of reward-claiming transactions.

---

## System Architecture

The project is structured as a monorepo using NestJS workspaces with three independent services:

1. **Chain Listener**: Monitors blockchain networks for swap events
2. **Event Processor & Scheduler**: Processes events and schedules reward claiming operations
3. **Transaction Processor**: Executes reward claiming transactions for appropriate blockchain

### Data Flow

- **Event Detection**: Chain listeners detect events and push them to a BullMQ queue.
- **Event Processing**: The event processor consumes events, stores swap data in DB, and schedules jobs for soon-claimable swaps using calculated delays based on reward timelock.
- **Transaction Execution**: The transaction processor consumes scheduled jobs, executes reward-claiming transactions, and records results in the DB.
-
---

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Caching & Queues**: Redis with BullMQ
- **Blockchain Interaction**: Ethers.js (for EVM chains)
- **Containerization**: Docker

---

## Project Structure

```
reward-service/
├── apps/
│   ├── evm-listener/              # EVM blockchain event monitoring
│   ├── event-processor-scheduler/ # Event processing and scheduling
│   └── evm-transaction-processor/ # EVM-based transaction execution and management
├── libs/
│   ├── blockchains/               # Blockchain abstraction and implementations
│   ├── database/                  # Database entities, migrations, and services
│   └── shared/                    # Common modules, configs, types, etc.
├── docker-compose.yml             # Development environment setup
├── Dockerfile                     # Multi-stage build definitions
└── package.json                   # Project metadata and scripts
```


## Under Development

#### Azure Key Vault for Private Keys
Currently, wallet private keys are configured via environment variables in the `.env` file, with a single private key used across EVM-based chains due to shared wallet addresses.

#### Support for Multiple RPC Nodes
To increase resilience and handle potential RPC node failures, the system will support configuration of multiple RPC nodes per blockchain network.


---

## Resources

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Contribution](./docs/CONTRIBUTION.md)

