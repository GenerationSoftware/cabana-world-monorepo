import {
  useAllUserVaultBalances,
  useSelectedVaults,
  useSortedVaults,
  useWorldPublicClient
} from '@generationsoftware/hyperstructure-react-hooks'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { LOCAL_STORAGE_KEYS, useAccount } from '@shared/generic-react-hooks'
import { ExternalLink } from '@shared/ui'
import { Button, Card } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { signInWithWallet } from 'src/utils'
import { Address } from 'viem'
import { setHooks } from '../minikit_txs'

const HOOK_ADDRESS = '0xc8de74eb7aaf00b0aa35343ba59d3c14b58f52b2' as Address
const VAULT_ADDRESS = '0x4c7e1f64a4b121d2f10d6fbca0db143787bf64bb' as Address

const BANNER_HIDDEN_KEY = 'hook-activation-banner-hidden'

export const HookActivationBanner = () => {
  const { address: userAddress } = useAccount()
  const [isActivating, setIsActivating] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const t_common = useTranslations('Common')

  const { setUserAddress } = useAccount()

  const { vaults } = useSelectedVaults()
  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress!)
  const { sortedVaults, isFetched: isFetchedSortedVaults } = useSortedVaults(vaults)
  const publicClient = useWorldPublicClient()

  const perWinnerBoostLimit = 500
  // const { perWinnerBoostLimit } = useHookPerWinnerBoostLimit(HOOK_ADDRESS)

  const { userHumanityVerified } = useUserHumanityVerified(userAddress)

  const vault = sortedVaults.filter((vault) => vault.address === VAULT_ADDRESS)[0]

  // Check if banner was previously hidden
  useEffect(() => {
    const hidden = localStorage.getItem(LOCAL_STORAGE_KEYS.hookActivationBannerHidden)
    if (hidden === 'true') {
      setIsHidden(true)
    }
  }, [])

  const handleHideBanner = () => {
    setIsHidden(true)
    localStorage.setItem(BANNER_HIDDEN_KEY, 'true')
  }

  if (!isFetchedSortedVaults || !vault || isHidden) {
    return null
  }
  console.log('vaultBalances')
  console.log(vaultBalances)

  const handleActivateHook = async () => {
    if (isActivating) {
      return
    }

    setIsActivating(true)

    try {
      await setHooks(
        VAULT_ADDRESS,
        HOOK_ADDRESS,
        true, // useBeforeClaimPrize
        true, // useAfterClaimPrize
        publicClient,
        {
          onSuccess: (txHash) => {
            console.log('Hook activated successfully:', txHash)
          },
          onError: () => {
            console.error('Failed to activate hook')
          }
        }
      )
    } catch (error) {
      console.error('Error activating hook:', error)
    } finally {
      setIsActivating(false)
    }
  }

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
          {userAddress && userHumanityVerified ? (
            <Button
              onClick={() => handleActivateHook()}
              disabled={isActivating}
              className='disabled:cursor-not-allowed'
            >
              {!userAddress
                ? t_common('signIn')
                : isActivating
                ? t_common('activating')
                : t_common('activateButtonCta')}
            </Button>
          ) : (
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
            className='flex items-center justify-center font-semibold text-white opacity-50 text-sm mt-4 hover:opacity-75 transition-opacity'
          >
            <XMarkIcon className='w-3 h-3 mr-1 stroke-2 stroke-white' /> {t_common('hideThis')}
          </button>
        </div>
      </Card>
    </div>
  )
}
