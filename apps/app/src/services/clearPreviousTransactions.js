import { updateStorageWith } from '../utils/updateStorageWith'

export const clearPreviousTransactions = (transactions, setTransactions, usersAddress, chainId) => {
  setTransactions([])

  updateStorageWith([], usersAddress, chainId)
}
