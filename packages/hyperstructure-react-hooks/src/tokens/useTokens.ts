import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { getTokenInfo } from '@shared/utilities'
import { useQueries, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, isAddress, zeroAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { populateCachePerId, usePublicClientsByChain } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a dictionary keyed by the token addresses with basic token data
 *
 * Stores queried token data in cache
 * @param chainId chain ID
 * @param tokenAddresses token addresses to query info for
 * @returns
 */
export const useTokens = (
  chainId: number,
  tokenAddresses: Address[]
): UseQueryResult<{ [tokenAddress: Address]: TokenWithSupply } | undefined, Error> => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    tokenAddresses.every(
      (tokenAddress) => !!tokenAddress && isAddress(tokenAddress) && tokenAddress !== zeroAddress
    ) &&
    Array.isArray(tokenAddresses) &&
    tokenAddresses.length > 0 &&
    !!publicClient

  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.tokens, chainId, val]

  return useQuery({
    queryKey: getQueryKey(tokenAddresses),
    queryFn: async () => {
      if (!!publicClient) {
        const tokenInfo = await getTokenInfo(publicClient, tokenAddresses)

        populateCachePerId(queryClient, getQueryKey, tokenInfo)

        return tokenInfo
      }
    },
    enabled,
    ...NO_REFETCH
  })
}

/**
 * Returns basic token data for one token
 *
 * Wraps {@link useTokens}
 * @param chainId chain ID
 * @param tokenAddress token address to query info for
 * @returns
 */
export const useToken = (
  chainId: number,
  tokenAddress: Address
): { data?: TokenWithSupply } & Omit<
  UseQueryResult<{ [tokenAddress: Address]: TokenWithSupply } | undefined, Error>,
  'data'
> => {
  const result = useTokens(chainId, [tokenAddress])
  return { ...result, data: result.data?.[tokenAddress] }
}

/**
 * Returns basic token data for for many tokens across many chains
 * @param tokenAddresses token addresses to query data for, keyed by chain ID
 * @returns
 */
export const useTokensAcrossChains = (tokenAddresses: { [chainId: number]: Address[] }) => {
  const publicClients = usePublicClientsByChain()

  const chainIds = Object.keys(tokenAddresses).map((chainId) => parseInt(chainId))

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const enabled =
        !!publicClients[chainId] &&
        tokenAddresses[chainId].every(
          (tokenAddress) => !!tokenAddress && isAddress(tokenAddress)
        ) &&
        Array.isArray(tokenAddresses[chainId]) &&
        tokenAddresses[chainId].length > 0

      return {
        queryKey: [QUERY_KEYS.tokens, chainId, tokenAddresses[chainId]],
        queryFn: async () => await getTokenInfo(publicClients[chainId], tokenAddresses[chainId]),
        enabled,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [chainId: number]: { [tokenAddress: Address]: TokenWithSupply } } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        const chainId = chainIds[i]
        formattedData[chainId] = result.data
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [results])
}
