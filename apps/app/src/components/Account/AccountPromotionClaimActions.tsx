import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { useAccount } from '@shared/generic-react-hooks'
import { TokenAmount, TransactionButton } from '@shared/react-components'
import {
  getSecondsSinceEpoch,
  lower,
  POOL_WIDE_TWAB_REWARDS_ADDRESSES,
  TWAB_REWARDS_ADDRESSES
} from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { claimPoolWideRewards, claimRewards, type ClaimRewardsTxOptions } from 'src/minikit_txs'
import { addRecentTransaction, signInWithWallet } from 'src/utils'
import { Address, formatUnits } from 'viem'
// import { useCapabilities } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionClaimActionsProps {
  chainId: number
  promotionId: bigint
  userAddress?: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  fullSized?: boolean
  className?: string
}

export const AccountPromotionClaimActions = (props: AccountPromotionClaimActionsProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, fullSized, className } =
    props

  const { address: _userAddress } = useAccount()

  if (!!userAddress) {
    return (
      <ClaimRewardsButton
        chainId={chainId}
        promotionId={promotionId}
        userAddress={userAddress ?? _userAddress}
        vaultAddress={vaultAddress}
        isPoolWide={isPoolWide}
        fullSized={fullSized}
        className={className}
      />
    )
  }

  return <></>
}

interface ClaimRewardsButtonProps {
  chainId: number
  promotionId: bigint
  userAddress: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  fullSized?: boolean
  className?: string
}

const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, fullSized, className } =
    props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')

  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  // const { openConnectModal } = useConnectModal()
  // const { openChainModal } = useChainModal()
  // const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchClaimed } = useUserClaimedPromotions(userAddress)
  const { refetch: refetchPoolWideClaimed } = useUserClaimedPoolWidePromotions(userAddress)

  const {
    data: allClaimable,
    isFetched: isFetchedAllClaimable,
    refetch: refetchClaimable
  } = useUserClaimablePromotions(userAddress)
  const {
    data: allPoolWideClaimable,
    isFetched: isFetchedAllPoolWideClaimable,
    refetch: refetchPoolWideClaimable
  } = useUserClaimablePoolWidePromotions(userAddress)

  const promotion = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimable : allClaimable).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimable, allPoolWideClaimable, chainId, promotionId, vaultAddress])

  const { data: token } = useToken(chainId, promotion?.token!)

  const epochsToClaim =
    !!promotion && (isPoolWide ? isFetchedAllPoolWideClaimable : isFetchedAllClaimable)
      ? Object.keys(promotion.epochRewards).map((k) => parseInt(k))
      : []

  const publicClient = useWorldPublicClient()

  // Get the appropriate twabRewards contract address
  const twabRewardsAddress = isPoolWide
    ? POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]
    : TWAB_REWARDS_ADDRESSES[chainId]

  const options: ClaimRewardsTxOptions = {
    onSend: () => {
      setIsConfirming(true)
    },
    onSuccess: (txHash: Address) => {
      setIsSuccessful(true)
      setTxHash(txHash)
      refetchClaimed()
      refetchClaimable()
      if (isPoolWide) {
        refetchPoolWideClaimed()
        refetchPoolWideClaimable()
      }
    },
    onSettled: () => {
      setIsConfirming(false)
    },
    onError: () => {
      setIsConfirming(false)
      setIsSuccessful(false)
    }
  }

  const sendClaimRewardsTransaction = () => {
    if (!promotion) return

    if (isPoolWide) {
      // For pool-wide promotions, we need to access the vault address differently
      // The promotion object has a different structure for pool-wide vs regular promotions
      const vaultAddress = (promotion as any).vaultAddress || promotion.vault
      if (!vaultAddress) return

      return claimPoolWideRewards(
        vaultAddress,
        userAddress,
        promotionId,
        epochsToClaim,
        publicClient,
        twabRewardsAddress,
        options
      )
    } else {
      return claimRewards(
        userAddress,
        promotionId,
        epochsToClaim,
        publicClient,
        twabRewardsAddress,
        options
      )
    }
  }

  if (!!promotion && !!token) {
    const claimableAmount = Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)

    if (claimableAmount > 0n) {
      const shiftedClaimableAmount = parseFloat(formatUnits(claimableAmount, token.decimals))

      const endTimestamp = !!promotion.numberOfEpochs
        ? Number(promotion.startTimestamp) + promotion.numberOfEpochs * promotion.epochDuration
        : undefined
      const isClaimWarningDisplayed = !!endTimestamp && endTimestamp < getSecondsSinceEpoch()

      return (
        <div className='flex flex-col'>
          <TransactionButton
            chainId={chainId}
            isTxLoading={isConfirming}
            isTxSuccess={isSuccessful}
            write={sendClaimRewardsTransaction}
            txHash={txHash}
            txDescription={t_account('claimRewardsTx', { symbol: token.symbol })}
            addRecentTransaction={addRecentTransaction}
            signInWithWallet={signInWithWallet}
            intl={{ common: t_common }}
            fullSized={fullSized}
            className={classNames('min-w-[6rem]', className)}
          >
            {t_common('claim')}{' '}
            <TokenAmount
              token={{ chainId, address: promotion.token, amount: claimableAmount }}
              hideZeroes={shiftedClaimableAmount > 1e3 ? true : undefined}
              maximumFractionDigits={shiftedClaimableAmount <= 1e3 ? 2 : undefined}
            />
          </TransactionButton>
          {isClaimWarningDisplayed && (
            <span className='mt-1 mr-1 text-right text-pt-warning-light'>
              {t_account('claimSoon')}
            </span>
          )}
        </div>
      )
    }
  }

  return <></>
}
