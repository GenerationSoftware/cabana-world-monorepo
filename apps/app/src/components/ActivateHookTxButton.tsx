import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { useAccount } from '@shared/generic-react-hooks'
import { Tooltip } from '@shared/ui'
import { Button } from '@shared/ui'
import { PRIZE_HOOK_ADDRESS, PRIZE_VAULT_ADDRESS } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { setHooks } from 'src/minikit_txs'
import { type Address } from 'viem'
import { useUserHumanityVerified } from '@hooks/useUserHumanityVerified'

type ActivateHookTxButtonProps = {
  isActivating: boolean
  setIsActivating: (val: boolean) => void
  onSuccess?: () => void
}

export const ActivateHookTxButton = (props: ActivateHookTxButtonProps) => {
  const { isActivating, setIsActivating, onSuccess } = props

  const publicClient = useWorldPublicClient()

  const t_common = useTranslations('Common')

  const { address: userAddress } = useAccount()
  const { data: userHumanityVerified, isFetched: userHumanityVerifiedIsFetched } =
    useUserHumanityVerified(userAddress as Address)

  const handleActivateHook = async () => {
    if (isActivating) {
      return
    }

    setIsActivating(true)

    try {
      await setHooks(PRIZE_VAULT_ADDRESS, PRIZE_HOOK_ADDRESS, publicClient, {
        onSuccess: (txHash) => {
          console.log('Hook activated successfully:', txHash)
          onSuccess?.()
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

  if (!userHumanityVerifiedIsFetched) {
    return null
  }

  const needsVerification = userHumanityVerifiedIsFetched && !userHumanityVerified?.isVerified

  if (needsVerification) {
    return (
      <Tooltip
        className='bg-red-400 text-white border-red-400'
        fullSized={true}
        content={<span>{t_common('prizeBoostHookNeedToBeVerified')}</span>}
      >
        <Button
          onClick={() => handleActivateHook()}
          disabled={true}
          className='disabled:cursor-not-allowed w-full'
        >
          {t_common('activateButtonCta')}
        </Button>
      </Tooltip>
    )
  }

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
