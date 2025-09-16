import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PRIZE_HOOK_ADDRESS, PRIZE_VAULT_ADDRESS, vaultABI } from '@shared/utilities'
import { lower } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

/**
 * Returns the state of the prize hook for a userAddress
 * @returns
 */
export const useIsHookSetStatus = (userAddress: Address) => {
  const publicClient = useWorldPublicClient()

  return useQuery({
    queryKey: ['userHumanityVerified', userAddress],
    queryFn: async () => {
      let isPrizeHookSet = false

      const hook = await publicClient.readContract({
        address: PRIZE_VAULT_ADDRESS,
        abi: vaultABI,
        functionName: 'getHooks',
        args: [userAddress]
      })

      if (lower(hook.implementation) === PRIZE_HOOK_ADDRESS && !!hook.useAfterClaimPrize) {
        isPrizeHookSet = true
      }

      return { isPrizeHookSet }
    },
    enabled: !!userAddress,
    ...NO_REFETCH
  })
}
