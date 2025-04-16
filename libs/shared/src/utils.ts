export interface BlockRange {
  fromBlock: number;
  toBlock: number;
}

/**
 * Generate an array of block ranges based on the start and end block numbers
 *
 * @param {number} start The starting block number
 * @param {number} end  The ending block number
 * @param {number} chunkSize The size of each chunk, default: 300
 *
 * @returns {BlockRange[]}
 */
export function generateBlockRanges(
  start: number,
  end: number,
  chunkSize: number = 300,
): BlockRange[] {
  const ranges: BlockRange[] = [];
  let fromBlock = start;

  while (fromBlock <= end) {
    const toBlock = Math.min(fromBlock + chunkSize - 1, end);

    ranges.push({ fromBlock, toBlock });
    fromBlock = toBlock + 1;
  }

  return ranges;
}
