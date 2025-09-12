import {
  useAllUserVaultBalances,
  useSelectedVaults,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAccount } from '@shared/generic-react-hooks'
import { Button, Card } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Address } from 'viem'
import { setHooks } from '../minikit_txs'

const HOOK_ADDRESS = '0xc8de74eb7aaf00b0aa35343ba59d3c14b58f52b2' as Address
const VAULT_ADDRESS = '0x4c7e1f64a4b121d2f10d6fbca0db143787bf64bb' as Address

export const HookActivationBanner = () => {
  const { address: userAddress } = useAccount()
  const [isActivating, setIsActivating] = useState(false)
  const [activatedVaults, setActivatedVaults] = useState<Set<string>>(new Set())

  const t_common = useTranslations('Common')

  const { vaults } = useSelectedVaults()
  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress!)
  const { sortedVaults, isFetched: isFetchedSortedVaults } = useSortedVaults(vaults)

  const vault = sortedVaults.filter((vault) => vault.address === VAULT_ADDRESS)[0]

  if (!isFetchedSortedVaults || !vault) {
    return null
  }
  console.log('vaultBalances')
  console.log(vaultBalances)

  const handleActivateHook = async (vaultId: string, vaultAddress: Address, client: any) => {
    if (isActivating) return

    setIsActivating(true)
    try {
      await setHooks(
        vaultAddress,
        HOOK_ADDRESS,
        true, // useBeforeClaimPrize
        true, // useAfterClaimPrize
        client,
        {
          onSuccess: (txHash) => {
            console.log('Hook activated successfully:', txHash)
            setActivatedVaults((prev) => new Set([...prev, vaultId]))
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
    <div className='relative w-screen flex justify-center gap-8 overflow-hidden mt-2 mb-4'>
      <Card
        wrapperClassName='bg-gradient-to-r from-blue-500 to-purple-600'
        className='w-[calc(100vw-2rem)] shrink-0 lg:w-[38rem] gap-2 text-white'
      >
        <h2 className='text-center text-3xl font-semibold'>
          ☝️ {t_common('activateHookTitle') || '5x Your Prizes!'} ☝️
        </h2>
        <p className='text-md text-center text-blue-200/80'>
          {t_common('hookActivationDescription') ||
            'As a fully verified World ID depositor you can earn 5x the prizes!.'}
        </p>
        <div className='flex flex-col gap-2 mt-3'>
          {/* <div
            key={vault.id}
            className='flex items-center justify-between bg-white/10 rounded-lg p-3'
          >
            <div className='flex flex-col'>
              <span className='font-semibold text-sm'>
                {vault.name || `Vault ${vault.address.slice(0, 6)}...${vault.address.slice(-4)}`}
              </span>
              <span className='text-xs text-blue-200'>
                {NETWORK[vault.chainId] || `Chain ${vault.chainId}`}
                {hasBalance && ' • You have a balance'}
              </span>
            </div>
            <Button
              onClick={() => handleActivateHook(vaultId, vault.address, client)}
              disabled={isActivating || !userAddress}
              className='disabled:cursor-not-allowed'
            >
              {!userAddress
                ? t_common('signIn')
                : isActivating
                ? t_common('activating')
                : t_common('activateButtonCta')}
            </Button>
          </div> */}
        </div>
      </Card>
    </div>
  )
}
