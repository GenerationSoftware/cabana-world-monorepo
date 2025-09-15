import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { worldIdABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

const WORLD_ID_ADDRESS_BOOK_ADDRESS = '0x57b930D551e677CC36e2fA036Ae2fe8FdaE0330D'

/**
 * Returns currently selected SUPPORTED_NETWORKS
 * @returns
 */
export const useUserHumanityVerified = (userAddress: Address) => {
  const publicClient = useWorldPublicClient()

  return useQuery({
    queryKey: ['userHumanityVerified', userAddress],
    queryFn: async () => {
      const verifiedUntil = await publicClient.readContract({
        address: WORLD_ID_ADDRESS_BOOK_ADDRESS,
        abi: worldIdABI,
        functionName: 'addressVerifiedUntil',
        args: [userAddress]
      })
      console.log('verifiedUntil')
      console.log(verifiedUntil)
      const needsVerification = !!verifiedUntil && verifiedUntil < Date.now() / 1000
      console.log('needsVerification')
      console.log(needsVerification)

      return {
        verifiedUntil,
        needsVerification
      }
    },
    enabled: !!userAddress,
    ...NO_REFETCH
  })
}
