/**
 * On chain HTLC swap status
 *
 * @see https://github.com/TrainProtocol/contracts/blob/ee0391e6f864faea0faecf51b5ffbf16d455fb62/chains/evm/solidity/contracts/Train.sol#L70
 */
export enum HtlcStatus {
  IN_PROGRESS = 0,
  REFUNDED = 2,
  REDEEMED = 3,
}

/**
 * On chain HTLC swap details
 */
export interface HtlcDetails {
  claimed: HtlcStatus;
  [key: string]: any;
}

/**
 * EVM emitted events for HTLC
 *
 * @see https://github.com/TrainProtocol/contracts/blob/main/chains/evm/solidity/contracts/Train.sol
 */
export enum EventType {
  LOCKED = 'TokenLocked',
  REDEEMED = 'TokenRedeemed',
  REFUNDED = 'TokenRefunded',
}

export interface TokenLockedEvent {
  type: EventType.LOCKED;
  id: string;
  dstNetwork: string;
  dstAsset: string;
  srcNetwork: string;
  srcAsset: string;
  hashlock: string;
  timelock: string;
  reward: string;
  rewardTimelock: string;
}

export interface TokenRedeemedEvent {
  type: EventType.REDEEMED;
  id: string;
  secret: string;
  network: string;
}

export interface TokenRefundedEvent {
  type: EventType.REFUNDED;
  id: string;
}

export type HtlcEvent =
  | TokenLockedEvent
  | TokenRefundedEvent
  | TokenRedeemedEvent;
