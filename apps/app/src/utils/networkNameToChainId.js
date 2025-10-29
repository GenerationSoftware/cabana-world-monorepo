import { getChainIdByAlias } from './networks'

export function networkNameToChainId(networkName) {
  return getChainIdByAlias(networkName)
}
