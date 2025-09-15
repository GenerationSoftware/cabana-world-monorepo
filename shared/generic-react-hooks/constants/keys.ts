/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = {
  coingeckoExchangeRates: 'coingeckoExchangeRates',
  coingeckoSimpleTokenPrices: 'coingeckoSimpleTokenPrices',
  coingeckoTokenData: 'coingeckoTokenData',
  coingeckoTokenPrices: 'coingeckoTokenPrices'
} as const

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  hookActivationBannerHidden: 'hookActivationBannerHidden',
  isTestnets: 'isTestnets',
  isDismissed: 'isDismissed',
  selectedCurrency: 'selectedCurrency',
  selectedLanguage: 'selectedLanguage',
  userAddress: 'userAddress'
} as const

/**
 * Modal keys
 */
export const MODAL_KEYS = {
  captcha: 'captcha',
  deposit: 'deposit',
  drawWinners: 'drawWinners',
  getNotified: 'getNotified',
  settings: 'settings',
  withdraw: 'withdraw',
  checkPrizes: 'checkPrizes',
  delegate: 'delegate'
} as const
