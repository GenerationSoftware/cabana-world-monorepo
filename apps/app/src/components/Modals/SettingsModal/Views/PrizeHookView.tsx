import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useAccount } from '@shared/generic-react-hooks'
import { BasicIcon, Button } from '@shared/ui'
import { PRIZE_HOOK_ADDRESS, PRIZE_VAULT_ADDRESS } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { unsetHooks } from 'src/minikit_txs'
import { type Address } from 'viem'
import { useIsHookSetStatus } from '@hooks/useIsHookSetStatus'

type PrizeHookViewProps = {
  showHeader?: boolean
}

export const PrizeHookView = (props: PrizeHookViewProps) => {
  const { showHeader } = props

  const t = useTranslations('Settings')
  const t_common = useTranslations('Common')

  const { address: userAddress } = useAccount()
  const [isResetting, setIsResetting] = useState(false)
  const [statusText, setStatusText] = useState('')

  const { data: prizeHookStatus, refetch: refetchPrizeHookStatus } = useIsHookSetStatus(
    userAddress as Address
  )
  const publicClient = useWorldPublicClient()

  useEffect(() => {
    if (prizeHookStatus?.isPrizeHookSet) {
      setStatusText(t('prizeHookEnabled'))
    } else {
      setStatusText(t('prizeHookDisabled'))
    }
  }, [prizeHookStatus?.isPrizeHookSet])

  const getStatusIcon = () => {
    if (prizeHookStatus?.isPrizeHookSet) {
      return <CheckCircleIcon className='h-6 w-6 text-green-400' />
    } else {
      return <XCircleIcon className='h-6 w-6 text-pt-purple-100' />
    }
  }

  const handleResetHooks = async () => {
    if (isResetting || !userAddress) return

    setIsResetting(true)

    try {
      await unsetHooks(PRIZE_VAULT_ADDRESS, publicClient, {
        onSuccess: (txHash) => {
          console.log('Hooks reset successfully:', txHash)
          refetchPrizeHookStatus()
        },
        onError: () => {
          console.error('Failed to reset hooks')
        }
      })
    } catch (error) {
      console.error('Error resetting hooks:', error)
    } finally {
      setIsResetting(false)
    }
  }

  if (!userAddress) {
    return (
      <div className='flex flex-col items-center gap-6 px-4 w-full'>
        {showHeader && (
          <span className='text-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
            {t('prizeHookSettings')}
          </span>
        )}
        <div className='text-center text-sm text-pt-purple-200 p-4 bg-pt-transparent/5 rounded-lg w-full'>
          <p>{t_common('signIn')} to manage your prize hook settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center gap-6 px-4 w-full'>
      {showHeader && (
        <span className='text-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
          {t('prizeHookSettings')}
        </span>
      )}

      <div className='flex flex-col items-center gap-4 w-full'>
        <div className='flex items-center gap-3 p-4 bg-pt-transparent/5 rounded-lg w-full'>
          <BasicIcon content={getStatusIcon()} size='lg' theme='dark' />
          <div className='flex flex-col w-full'>
            <span className='text-pt-purple-50 font-medium'>{t('prizeHookStatus')}</span>
            <span className='text-sm text-pt-purple-200'>{statusText}</span>
          </div>
        </div>

        {prizeHookStatus?.isPrizeHookSet && (
          <div className='text-center text-sm text-green-400 p-4 bg-green-400/10 rounded-lg w-full'>
            <p>{t('prizeHookActiveDescription')}</p>
          </div>
        )}

        {!prizeHookStatus?.isPrizeHookSet && (
          <div className='text-center text-sm text-pt-purple-200 p-4 bg-pt-transparent/5 rounded-lg w-full'>
            <p>{t('prizeHookInactiveDescription')}</p>
          </div>
        )}

        {prizeHookStatus?.isPrizeHookSet && (
          <Button
            onClick={handleResetHooks}
            disabled={isResetting}
            className='w-full px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50'
          >
            {isResetting ? t('resettingHooks') : t('resetHooks')}
          </Button>
        )}

        <div className='text-xs text-pt-purple-300 text-center w-full'>
          <p>
            {t('prizeHookAddress')}: {PRIZE_HOOK_ADDRESS}
          </p>
          <p>
            {t('prizeVaultAddress')}: {PRIZE_VAULT_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  )
}
