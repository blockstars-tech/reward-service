import { Contract, JsonRpcProvider, LogDescription, TopicFilter } from 'ethers';
import { Injectable, Logger } from '@nestjs/common';
import { NetworkConfig, NetworkName } from '@lib/shared/config';
import { EventType, HtlcEvent } from '@lib/shared/types';
import { BlockchainListener } from '../abstract/blockchain-listener';

@Injectable()
export class EvmListener extends BlockchainListener {
  private readonly logger = new Logger(EvmListener.name);
  private readonly provider: JsonRpcProvider;
  private readonly contract: Contract;

  constructor(network: NetworkConfig) {
    super(network);

    this.provider = new JsonRpcProvider(network.rpcUrl);
    this.contract = new Contract(
      network.contracts.native.address,
      network.contracts.native.abi,
      this.provider,
    );
  }

  /**
   * Retrieves the current block number
   *
   * @returns {Promise<number>} The current block number
   */
  async getCurrentBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  /**
   * Retrieves HTLC events from the contracts within the specified block range
   *
   * @param {number} fromBlock The starting block number
   * @param {number} toBlock The ending block number
   *
   * @returns {Promise<HtlcEvent[]>} The HTLC events
   */
  async getEventLogs(fromBlock: number, toBlock: number): Promise<HtlcEvent[]> {
    try {
      // @todo Add erc20 contract address
      const eventLogs = await this.provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: [this.network.contracts.native.address],
        topics: this.getTopicFilters(),
      });

      if (!eventLogs.length) {
        return [];
      }

      const eventResults: HtlcEvent[] = [];

      for (const eventLog of eventLogs) {
        const parsedLog = this.contract.interface.parseLog(eventLog);

        if (!parsedLog) {
          continue;
        }

        const parsedEvent = this.parseEvent(parsedLog);

        if (parsedEvent) {
          eventResults.push(parsedEvent);
        }
      }

      return eventResults;
    } catch (error) {
      this.logger.error(
        error,
        `Failed to fetch event logs from ${fromBlock} to ${toBlock}`,
      );

      throw error;
    }
  }

  /**
   * Parses the event log and returns the corresponding HtlcEvent object
   *
   * @param {LogDescription} parsedLog The parsed log description
   *
   * @returns {HtlcEvent | null} The parsed HtlcEvent object or null if the event is not relevant
   */
  private parseEvent(parsedLog: LogDescription): HtlcEvent | null {
    const { name, args } = parsedLog;
    const eventType = name as EventType;

    switch (eventType) {
      case EventType.LOCKED: {
        const rewardAmount = args.reward as bigint;

        // Skip if the reward amount is zero, or can be specified min amount required to process
        if (!rewardAmount) {
          this.logger.warn(
            `Swap with id ${args.Id} has no reward. Skipping event.`,
          );

          return null;
        }

        return {
          type: EventType.LOCKED,
          id: args.Id as string,
          hashlock: args.hashlock as string,
          dstNetwork: args.dstChain as string,
          dstAsset: args.dstAsset as string,
          srcNetwork: NetworkName.ETHEREUM_SEPIOLA,
          srcAsset: args.srcAsset as string,
          reward: rewardAmount.toString(),
          rewardTimelock: (args.rewardTimelock as bigint).toString(),
          timelock: (args.timelock as bigint).toString(),
        };
      }
      case EventType.REFUNDED:
        return { type: EventType.REFUNDED, id: args.Id as string };
      case EventType.REDEEMED:
        return {
          type: EventType.REDEEMED,
          id: args.Id as string,
          secret: (args.secret as bigint).toString(),
          network: this.network.name,
        };
      default:
        return null;
    }
  }

  /**
   * Get the topic filters hashes for the events that should be listened to
   *
   * @returns {TopicFilter} The topic filters for the events
   */
  private getTopicFilters(): TopicFilter {
    return [
      [
        this.contract.interface.getEvent('TokenLocked')?.topicHash,
        this.contract.interface.getEvent('TokenRefunded')?.topicHash,
        this.contract.interface.getEvent('TokenRedeemed')?.topicHash,
      ],
    ] as TopicFilter;
  }
}
