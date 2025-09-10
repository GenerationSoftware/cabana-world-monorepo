import { useAllUserVaultBalances, useSelectedVaults, usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { useAccount } from '@shared/generic-react-hooks'
import { Card } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Address } from 'viem'
import { setHooks } from '../minikit_txs'

const HOOK_ADDRESS = '0xc8de74eb7aaf00b0aa35343ba59d3c14b58f52b2' as Address

export const HookActivationBanner = () => {
  const { address: userAddress } = useAccount()
  const { vaults } = useSelectedVaults()
  const clientsByChain = usePublicClientsByChain()
  const [isActivating, setIsActivating] = useState(false)
  const [activatedVaults, setActivatedVaults] = useState<Set<string>>(new Set())

  const t_common = useTranslations('Common')

  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress!)

  if (!userAddress || !vaultBalances) {
    return null
  }

  // Get vaults where user has balance but hasn't activated the hook yet
  const vaultsWithBalance = Object.entries(vaultBalances)
    .filter(([vaultId, balance]) => balance.amount > 0n && !activatedVaults.has(vaultId))
    .map(([vaultId]) => {
      const vault = vaults.vaults[vaultId]
      return { vaultId, vault, client: clientsByChain[vault.chainId] }
    })

  if (vaultsWithBalance.length === 0) {
    return null
  }

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
            setActivatedVaults(prev => new Set([...prev, vaultId]))
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
        <h4 className='text-center text-xl font-bold'>
          🎯 {t_common('activateHook') || 'Activate Prize Hook'}
        </h4>
        <p className='text-sm text-center text-blue-100'>
          {t_common('hookActivationDescription') || 
           'Enhance your prize experience by activating the new prize hook for your vaults.'}
        </p>
        <div className='flex flex-col gap-2 mt-3'>
          {vaultsWithBalance.slice(0, 3).map(({ vaultId, vault, client }) => (
            <div key={vaultId} className='flex items-center justify-between bg-white/10 rounded-lg p-3'>
              <div className='flex flex-col'>
                <span className='font-semibold text-sm'>
                  {vault.name || `Vault ${vault.address.slice(0, 6)}...${vault.address.slice(-4)}`}
                </span>
                <span className='text-xs text-blue-200'>
                  {NETWORK[vault.chainId] || `Chain ${vault.chainId}`}
                </span>
              </div>
              <button
                onClick={() => handleActivateHook(vaultId, vault.address, client)}
                disabled={isActivating}
                className='px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors'
              >
                {isActivating ? 'Activating...' : 'Activate'}
              </button>
            </div>
          ))}
          {vaultsWithBalance.length > 3 && (
            <p className='text-xs text-center text-blue-200 mt-2'>
              +{vaultsWithBalance.length - 3} more vaults available
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
