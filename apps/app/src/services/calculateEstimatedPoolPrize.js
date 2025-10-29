import { ethers } from 'ethers'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_BLOCK } from '../constants'
import { normalizeTo18Decimals } from '../utils/normalizeTo18Decimals'

const bn = ethers.BigNumber.from

export function calculateEstimatedPoolPrize({
  ticketSupply,
  totalSponsorship,
  awardBalance,
  underlyingCollateralDecimals,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds
}) {
  const decimals = underlyingCollateralDecimals || DEFAULT_TOKEN_PRECISION

  awardBalance = awardBalance || bn(0)
  awardBalance = normalizeTo18Decimals(awardBalance, decimals)

  let totalSupply =
    ticketSupply && totalSponsorship ? bn(ticketSupply).add(bn(totalSponsorship)) : '0'
  totalSupply = normalizeTo18Decimals(totalSupply, decimals)

  const supplyRatePerBlockBN = supplyRatePerBlock || bn(0)

  const remainingSeconds = prizePeriodRemainingSeconds ? prizePeriodRemainingSeconds : bn(0)
  const blocksRemainingBN = remainingSeconds.div(SECONDS_PER_BLOCK)

  const additionalYield = totalSupply
    .mul(supplyRatePerBlockBN)
    .mul(blocksRemainingBN)
    .div(ethers.constants.WeiPerEther)

  const estimatedPrizeBN = additionalYield.add(awardBalance)

  return ethers.utils.formatEther(estimatedPrizeBN)
}
