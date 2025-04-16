import { BigNumberish } from 'ethers';
import { HexString } from 'ethers/lib.commonjs/utils/data';

export interface RedeemTransactionParams {
  id: HexString;
  secret: BigNumberish;
}

export interface FeeData {
  /**
   * The estimated fee for the transaction.
   */
  estimatedFee: bigint;
  /**
   * Whether the fee data is for a legacy transaction or EIP-1559 transaction.
   */
  isLegacy: boolean;
  /**
   * The gas price for legacy networks.
   */
  gasPrice?: bigint;
  /**
   *  The maximum fee to pay per gas.
   *  This will be `null` on legacy networks
   */
  maxFeePerGas?: bigint;
  /**
   *  The additional amout to pay per gas to encourage a validator
   *  to include the transaction.
   *  This will be `null` on legacy networks
   */
  maxPriorityFeePerGas?: bigint;
}
