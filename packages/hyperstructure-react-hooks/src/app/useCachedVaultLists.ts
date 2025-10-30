import { VaultList } from '@shared/types'
import { atom, useAtom } from 'jotai'

const getInitialCachedVaultLists = (): { [id: string]: VaultList } => {
  if (typeof window === 'undefined') return {}
  return JSON.parse('{}')
}

const cachedVaultListsAtom = atom<{ [id: string]: VaultList | undefined }>(
  getInitialCachedVaultLists()
)

/**
 * Returns currently cached vault lists
 *
 * Stores state in local storage
 * @returns
 */
export const useCachedVaultLists = () => {
  const [cachedVaultLists, setCachedVaultLists] = useAtom(cachedVaultListsAtom)

  const set = (vaultLists: { [id: string]: VaultList }) => {
    setCachedVaultLists(vaultLists)
  }

  const cache = (id: string, vaultList: VaultList) => {
    setCachedVaultLists((prev) => ({ ...prev, [id]: vaultList }))
  }

  const remove = (id: string) => {
    setCachedVaultLists((prev) => ({ ...prev, [id]: undefined }))
  }

  const clear = () => {
    setCachedVaultLists({})
  }

  return {
    cachedVaultLists,
    set,
    cache,
    remove,
    clear
  }
}
