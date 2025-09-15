import {
  useSelectedVaults,
  useSortedVaults,
  useWorldPublicClient
} from '@generationsoftware/hyperstructure-react-hooks'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { LOCAL_STORAGE_KEYS, useAccount } from '@shared/generic-react-hooks'
import { Tooltip } from '@shared/ui'
import { Button, Card, ExternalLink } from '@shared/ui'
import { LINKS, PRIZE_HOOK_ADDRESS, PRIZE_VAULT_ADDRESS } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { signInWithWallet } from 'src/utils'
import { type Address } from 'viem'
import { useIsHookSetStatus } from '@hooks/useIsHookSetStatus'
import { useUserHumanityVerified } from '@hooks/useUserHumanityVerified'
import { setHooks } from '../minikit_txs'

export const HookActivationBanner = () => {
  const { address: userAddress, setUserAddress } = useAccount()
  const [isActivating, setIsActivating] = useState<boolean>(false)
  const [isHidden, setIsHidden] = useState(false)

  const t_common = useTranslations('Common')

  const { data: prizeHookStatus, refetch: refetchPrizeHookStatus } = useIsHookSetStatus(
    userAddress as Address
  )
  console.log('prizeHookStatus')
  console.log(prizeHookStatus)

  useEffect(() => {
    if (!isActivating === false) {
      console.log('refetching prize hook status ...')
      refetchPrizeHookStatus()
    }
  }, [isActivating])

  const { vaults } = useSelectedVaults()
  // const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress!)
  const { sortedVaults, isFetched: isFetchedSortedVaults } = useSortedVaults(vaults)

  const perWinnerBoostLimit = 500
  // const { perWinnerBoostLimit } = useHookPerWinnerBoostLimit(PRIZE_HOOK_ADDRESS)

  const vault = sortedVaults.filter((vault) => vault.address === PRIZE_VAULT_ADDRESS)[0]

  // Check if banner was previously hidden
  useEffect(() => {
    const hidden = localStorage.getItem(LOCAL_STORAGE_KEYS.hookActivationBannerHidden)
    if (hidden === 'true') {
      setIsHidden(true)
    }
  }, [])

  const handleHideBanner = () => {
    setIsHidden(true)
    localStorage.setItem(LOCAL_STORAGE_KEYS.hookActivationBannerHidden, 'true')
  }

  if (!isFetchedSortedVaults || !vault || isHidden) {
    return null
  }
  // console.log('vaultBalances')
  // console.log(vaultBalances)

  return (
    <div className='relative w-screen flex justify-center gap-8 overflow-hidden mt-2 mb-4 font-averta'>
      <Card
        wrapperClassName='bg-gradient-to-r from-blue-500 to-purple-600 bg-cover'
        className='w-[calc(100vw-2rem)] shrink-0 lg:w-[38rem] gap-2 text-white'
        style={{
          backgroundImage: `url(hook-bg.jpg)`
        }}
      >
        <h2 className='text-center text-3xl font-semibold'>
          {/* ☝️ {t_common('activateHookTitle') || '5x Your Prizes!'} ☝️ */}
          {t_common('activateHookTitle') || '5x Your Prizes!'}
        </h2>
        <p className='text-md text-center text-white/70'>
          {t_common('hookActivationDescription') ||
            'As a fully verified World ID depositor you can earn 5x the prizes!.'}
        </p>
        <div className='flex flex-col gap-2 mt-3'>
          {!userAddress && (
            <Button
              onClick={() => {
                signInWithWallet(setUserAddress)
              }}
            >
              <div className='inline-flex gap-3 font-medium'>
                <span>{t_common('signIn')}</span>
              </div>
            </Button>
          )}

          {prizeHookStatus?.isPrizeHookSet ? (
            <div className='text-center text-green-400 p-4 bg-green-400/10 rounded-lg w-full'>
              <p>{t_common('prizeHookIsSet')}</p>
            </div>
          ) : (
            <ActivateHookTxButton isActivating={isActivating} setIsActivating={setIsActivating} />
          )}

          <p className='text-sm text-center text-white/70 px-4'>
            *{' '}
            {t_common('hookStipulationOne', {
              boostTotalPerAccount: perWinnerBoostLimit
            })}{' '}
            {t_common('hookStipulationTwo')}
            <ExternalLink
              href={LINKS.worldPrizeHookPost}
              size='sm'
              className='grow text-blue-400 underline ml-1'
            >
              {t_common('learnMore')}
            </ExternalLink>
          </p>

          <button
            onClick={handleHideBanner}
            className={classNames(
              'flex items-center justify-center font-semibold text-white mt-4 hover:opacity-75 transition-opacity mx-auto',
              {
                'text-md': prizeHookStatus?.isPrizeHookSet,
                'text-sm opacity-50': !prizeHookStatus?.isPrizeHookSet
              }
            )}
          >
            <XMarkIcon className='w-3 h-3 mr-1 stroke-2 stroke-white' /> {t_common('hideThis')}
          </button>
        </div>
      </Card>
    </div>
  )
}

type ActivateHookTxButtonProps = {
  isActivating: boolean
  setIsActivating: (val: boolean) => void
}

const ActivateHookTxButton = (props: ActivateHookTxButtonProps) => {
  const { isActivating, setIsActivating } = props

  const publicClient = useWorldPublicClient()

  const t_common = useTranslations('Common')

  const { address: userAddress } = useAccount()
  const { data: userHumanityVerified } = useUserHumanityVerified(userAddress as Address)

  const handleActivateHook = async () => {
    if (isActivating) {
      return
    }

    setIsActivating(true)

    try {
      await setHooks(PRIZE_VAULT_ADDRESS, PRIZE_HOOK_ADDRESS, publicClient, {
        onSuccess: (txHash) => {
          console.log('Hook activated successfully:', txHash)
        },
        onError: () => {
          console.error('Failed to activate hook')
        }
      })
    } catch (error) {
      console.error('Error activating hook:', error)
    } finally {
      setIsActivating(false)
    }
  }

  if (!userAddress) {
    return null
  }

  const needsVerification = !userHumanityVerified?.isVerified

  // if (needsVerification) {
  //   return (
  //     <Tooltip
  //       className='bg-red-400 text-white border-red-400'
  //       fullSized={true}
  //       content={<span>{t_common('prizeBoostHookNeedToBeVerified')}</span>}
  //     >
  //       <Button
  //         onClick={() => handleActivateHook()}
  //         disabled={true}
  //         className='disabled:cursor-not-allowed w-full'
  //       >
  //         {t_common('activateButtonCta')}
  //       </Button>
  //     </Tooltip>
  //   )
  // }

  return (
    <Button
      onClick={() => handleActivateHook()}
      disabled={isActivating}
      className='disabled:cursor-not-allowed'
    >
      {isActivating ? t_common('activating') : t_common('activateButtonCta')}
    </Button>
  )
}
