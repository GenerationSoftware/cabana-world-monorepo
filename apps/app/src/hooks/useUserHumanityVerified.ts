import { useWorldPublicClient } from '@generationsoftware/hyperstructure-react-hooks'
import { worldIdABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

const WORLD_ID_ADDRESS_BOOK_ADDRESS = '0x57b930D551e677CC36e2fA036Ae2fe8FdaE0330D'

/**
 * Returns World ID Verification status for a userAddress
 * @returns
 */
export const useUserHumanityVerified = (userAddress: Address) => {
  const publicClient = useWorldPublicClient()
  return useQuery({
    queryKey: ['userHumanityVerified', userAddress],
    queryFn: async () => {
      console.log('in here?!')
      const verifiedUntil = await publicClient.readContract({
        address: WORLD_ID_ADDRESS_BOOK_ADDRESS,
        abi: worldIdABI,
        functionName: 'addressVerifiedUntil',
        args: [userAddress]
      })

      const isVerified = !!verifiedUntil && verifiedUntil > Date.now() / 1000

      return {
        isVerified,
        verifiedUntil
      }
    },
    enabled: !!userAddress
  })
}
