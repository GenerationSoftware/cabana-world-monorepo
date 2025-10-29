import { atom, useAtom } from 'jotai'

export const walletIdOverwriteAtom = atom<string>('')

/**
 * Returns the currently connected wallet's ID
 * @returns
 */
export const useWalletId = () => {
  const [walletIdOverwrite, setWalletId] = useAtom(walletIdOverwriteAtom)

  const walletId = walletIdOverwrite

  return { walletId, setWalletId }
}
