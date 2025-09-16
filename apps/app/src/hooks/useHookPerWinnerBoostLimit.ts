import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PRIZE_HOOK_ADDRESS, prizeBoostHookABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'

/**
 * Returns the perWinnerBoostLimit for the 5x prize hook
 * @returns
 */
export const useHookPerWinnerBoostLimit = () => {
  const publicClient = useWorldPublicClient()

  return useQuery({
    queryKey: ['hookPerWinnerBoostLimit'],
    queryFn: async () => {
      return await publicClient.readContract({
        address: PRIZE_HOOK_ADDRESS,
        abi: prizeBoostHookABI,
        functionName: 'perWinnerBoostLimit'
      })
    },
    ...NO_REFETCH
  })
}
