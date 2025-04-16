# System Overview

This document provides a detailed explanation of the system architecture, data flow, and component interactions.

[!import diagram]

## Core Components

### Chain Listeners

The system is designed with a pluggable chain listener architecture, allowing easy integration of various blockchain networks:

##### EVM Listener Service

The EVM Listener service is responsible for monitoring EVM-compatible blockchain networks:

- Initializes connections to configured blockchain networks (Ethereum, Optimism, Arbitrum)
- Polls blocks at intervals tailored to each network's confirmation time
- Filters events based on contract addresses and topics
- Pushes detected events to the centralized event queue for processing

###### Event Types

- **TokenLocked**: Indicates funds locked on the destination chain with a potential reward
- **TokenRedeemed**: Indicates funds have been redeemed, revealing the secret needed to claim rewards
- **TokenRefunded**: Indicates a canceled swap (no reward can be claimed)

### Event Processor & Scheduler Service

This centralized service handles events from all chain listeners:

1. **Event Processing**:
   - Consumes events from the unified event queue
   - Processes events based on their type (Locked, Redeemed, Refunded)
   - Stores processed swap information in the database

2. **Reward Scheduling**:
   - Runs periodic checks to find swaps with upcoming reward timelock expirations
   - Calculates the time remaining until a reward becomes claimable
   - Schedules delayed jobs in the reward queue with chain-specific job identifiers
   - Cancels scheduled jobs if swaps are refunded or redeemed by others

### Transaction Processor Service

This service is responsible for executing the actual blockchain transactions to claim rewards:

- Consumes jobs from the reward queue
- Identifies the destination blockchain from the job properties
- Verifies on-chain state to ensure the reward hasn't been claimed
- Estimates transaction fees and checks wallet balance
- Manages transaction parameters (nonce, gas limit, gas price (legacy/EIP-1559))
- Executes transactions and handles errors
- Stores transaction history with information

## Data Flow

1. **Event Detection**:
   - Chain-specific listeners detects HTLC events on the blockchain
   - Events are standardized and pushed to the centralized event queue in Redis

2. **Event Processing**:
   - The Event Processor consumes events from the queue
   - Events are processed and stored in the PostgreSQL database

3. **Reward Scheduling**:
   - The Scheduler identifies swaps approaching their reward timelock expiration
   - Delayed jobs are scheduled in the reward queue with chain named processor

4. **Transaction Execution**:
   - The Transaction Processor consumes jobs from the reward queue
   - Based on chain identifier in the job, routes to appropriate chain handler
   - Executes transactions to claim rewards
   - Records transaction results

## Database Schema

The system uses PostgreSQL with TypeORM for data persistence. Key entities include:

- **Swaps**: Records of cross-chain swaps with their HTLC IDs, network inforamtion, on-chain status, reward information.
- **Transactions**: Records of transaction attempts with results and fees for each HTLC swap.

## Queue System

The system uses Redis with BullMQ for message queuing:

- **Event Queue**: For storing detected blockchain events before processing
- **Reward Queue**: For scheduling delayed reward claiming jobs

## Error Handling

The system implements error handling strategies:

- All queued jobs have a default retry mechanism that attempts 3 retries using exponential backoff (configurable)
- Thorough logging for troubleshooting
- Nonce management for transaction conflicts

#### Distributed Nonce Management

For EVM transactions, the system includes nonce management system:

- Uses Redis for distributed nonce tracking across multiple service instances
- Implements a distributed locking mechanism to prevent nonce conflicts
- Provides the ability to reset cached nonces
- Handles race conditions through Lua scripts ensuring atomicity

## Configuration System

The system uses a hierarchical configuration approach:

- Environment variables for deployment-specific settings
- Chain-specific configurations for different blockchain networks
- Default fallback values for optional parameters

