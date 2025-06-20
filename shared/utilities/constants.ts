import { Address } from 'viem'
import { Token } from '../types'
import { lower } from './utils/addresses'

/**
 * Network IDs
 */
export enum NETWORK {
  mainnet = 1,
  sepolia = 11155111,
  bsc = 56,
  bsc_testnet = 97,
  polygon = 137,
  mumbai = 80001,
  optimism = 10,
  optimism_sepolia = 11155420,
  avalanche = 43114,
  fuji = 43113,
  celo = 42220,
  celo_testnet = 44787,
  arbitrum = 42161,
  arbitrum_sepolia = 421614,
  base = 8453,
  base_sepolia = 84532,
  scroll = 534352,
  scroll_sepolia = 534351,
  gnosis = 100,
  gnosis_chiado = 10200,
  world = 480,
  world_sepolia = 4801
}
export type NETWORK_NAME = keyof typeof NETWORK

/**
 * POOL token addresses
 */
export const POOL_TOKEN_ADDRESSES = {
  [NETWORK.mainnet]: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
  [NETWORK.world]: '0x7077C71B4AF70737a08287E279B717Dcf64fdC57',
  [NETWORK.gnosis_chiado]: '0xa83a315bed18b36308a518c7f77a2464e9f7286c'
} as const satisfies { [chainId: number]: Address }

/**
 * USDC token addresses
 */
export const USDC_TOKEN_ADDRESSES: { [chainId: number]: Lowercase<Address> } = {
  [NETWORK.world]: '0x79a02482a880bce3f13e09da970dc34db4cd24d1',
  [NETWORK.gnosis_chiado]: '0xfc535b2407bb2c8b4f4a4faabbb9981ff031b7ca'
}

/**
 * Prize Pools
 */
export const PRIZE_POOLS: {
  chainId: NETWORK
  address: Address
  options: {
    prizeTokenAddress: Address
    drawManagerAddress: Address
    twabControllerAddress: Address
    drawPeriodInSeconds: number
    drawAuctionDurationInSeconds: number
    tierShares: number
    reserveShares: number
  }
}[] = [
  {
    chainId: NETWORK.world,
    address: '0x99ffb0A6c0CD543861c8dE84dd40E059FD867dcF',
    options: {
      prizeTokenAddress: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003',
      drawManagerAddress: '0x62800f9bd164eA909224e19B7fDFA33a0f3f6373',
      twabControllerAddress: '0xA13d89cF3e7f59bA1a2B5B5c260bDfc64DD1044C',
      drawPeriodInSeconds: 86_400,
      drawAuctionDurationInSeconds: 10_800,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.gnosis_chiado,
    address: '0x678b5a8b958e1582b2677dc21f7fdef4476d9bd7',
    options: {
      prizeTokenAddress: '0xb2d0d7ad1d4b2915390dc7053b9421f735a723e7',
      drawManagerAddress: '0x6ffe9015659a212f5b64d477511d6e32cbdb9c78',
      twabControllerAddress: '0x8c2a569bb0fecb37258c0984c3b52b4aedcc3e8e',
      drawPeriodInSeconds: 14_400,
      drawAuctionDurationInSeconds: 3_600,
      tierShares: 100,
      reserveShares: 30
    }
  }
]

/**
 * Stablecoin addresses and their corresponding fiat currency
 */
export const STABLECOINS: Record<number, { [address: Lowercase<Address>]: string }> = {
  [NETWORK.gnosis_chiado]: {
    '0xfc535b2407bb2c8b4f4a4faabbb9981ff031b7ca': 'usd', // USDC
    '0xbe9a62939f82e12f4a48912078a4420f1a5fc2e0': 'usd', // GUSD
    '0xb2d0d7ad1d4b2915390dc7053b9421f735a723e7': 'usd' // WXDAI
  },
  [NETWORK.world]: {
    '0x79a02482a880bce3f13e09da970dc34db4cd24d1': 'usd' // USDC
  }
}

/**
 * Dolphin address
 */
export const DOLPHIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Dead address
 */
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

/**
 * Optimism gas oracle address
 */
export const OP_GAS_ORACLE_ADDRESS = '0x420000000000000000000000000000000000000f'

/**
 * Native assets' info
 */
export const NATIVE_ASSETS: Record<number, Token> = {
  [NETWORK.gnosis_chiado]: {
    chainId: NETWORK.gnosis_chiado,
    address: DOLPHIN_ADDRESS,
    symbol: 'XDAI',
    name: 'XDAI',
    decimals: 18
  },
  [NETWORK.world]: {
    chainId: NETWORK.world,
    address: DOLPHIN_ADDRESS,
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18
  },
  [NETWORK.mainnet]: {
    chainId: NETWORK.mainnet,
    address: DOLPHIN_ADDRESS,
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18
  }
}

/**
 * Wrapped native asset addresses (example: WETH, WMATIC, etc.)
 */
export const WRAPPED_NATIVE_ASSETS: Record<number, Lowercase<Address> | null> = {
  [NETWORK.mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK.sepolia]: null,
  [NETWORK.bsc]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [NETWORK.bsc_testnet]: null,
  [NETWORK.polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [NETWORK.mumbai]: null,
  [NETWORK.optimism]: '0x4200000000000000000000000000000000000006',
  [NETWORK.optimism_sepolia]: null,
  [NETWORK.avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [NETWORK.fuji]: null,
  [NETWORK.celo]: null,
  [NETWORK.celo_testnet]: null,
  [NETWORK.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [NETWORK.arbitrum_sepolia]: null,
  [NETWORK.base]: '0x4200000000000000000000000000000000000006',
  [NETWORK.base_sepolia]: null,
  [NETWORK.scroll]: '0x5300000000000000000000000000000000000004',
  [NETWORK.scroll_sepolia]: null,
  [NETWORK.gnosis]: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
  [NETWORK.gnosis_chiado]: null,
  [NETWORK.world]: '0x4200000000000000000000000000000000000006',
  [NETWORK.world_sepolia]: null
}

/**
 * TWAB rewards addresses
 */
export const TWAB_REWARDS_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0x2589ff8614f74704741ee3b51851b4ae812f1a21',
  [NETWORK.optimism]: '0x90D383dEA4dcE52D3e5D3C93dE75eF36da3Ea9Ea',
  [NETWORK.base]: '0x86f0923d20810441efc593eb0f2825c6bff2dc09',
  [NETWORK.arbitrum]: '0xe21ac38a7e80104c4f6512ce4908a22bc09c59be',
  [NETWORK.scroll]: '0x0e71a9a2bd4546e7fc2af47a015747daeb48780d',
  [NETWORK.gnosis]: '0x1742157e6ef6e0cf7e49904f2c0d0fe38a276942',
  [NETWORK.world]: '0x18e9e34cfccadcac465a8b6eaf337546b0980897',
  [NETWORK.optimism_sepolia]: '0x3FF7A54024E4db58F9682a637CeA7E72237B9e69',
  [NETWORK.arbitrum_sepolia]: '0x6f38ebc8587e2e6b2f79d9f8d045abf44a3bfd13',
  [NETWORK.base_sepolia]: '0x3af156d5eae4bb67afbe9e96e646371f7ba37d18',
  [NETWORK.scroll_sepolia]: '0xeFdFF129414E7E7eA5223c69CB71cED17F5658AC',
  [NETWORK.gnosis_chiado]: '0xcaca4272be2030ef3f06eb0d8a115e411f7db34f'
}

/**
 * Pool-Wide TWAB rewards addresses
 */
export const POOL_WIDE_TWAB_REWARDS_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0x3341DAC0912B630F1A8c237b64F6861e9fa11d79',
  [NETWORK.optimism]: '0x36bE31E7acD4B0D755BCc7858ef04848A3eC66c6',
  [NETWORK.base]: '0xF4c47dacFda99bE38793181af9Fd1A2Ec7576bBF',
  [NETWORK.arbitrum]: '0x0D51a33975024E8aFc55fde9F6b070c10AA71Dd9',
  [NETWORK.scroll]: '0x0D51a33975024E8aFc55fde9F6b070c10AA71Dd9',
  [NETWORK.gnosis]: '0x0D51a33975024E8aFc55fde9F6b070c10AA71Dd9',
  [NETWORK.optimism_sepolia]: '0x1B7070eb6f871ba0d77470918502F8D788978FA3'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0xd499ccf3e93f4cfb335ac388e3c896d59cdde7c3',
  [NETWORK.optimism]: '0xec9f59bD06465b105e719c0b0483A4Ed6A656775',
  [NETWORK.base]: '0xa55a74A457D8a24D68DdA0b5d1E0341746d444Bf',
  [NETWORK.arbitrum]: '0x8020Fb37b21E0eF1707aDa7A914baf44F9045E52',
  [NETWORK.scroll]: '0x3fdd8bfdf2f589c10c58457cdae989c7943a30a5',
  [NETWORK.gnosis]: '0xc3aE3FE36A2645a93b2Fe350D81E80A14831e2A6',
  [NETWORK.world]: '0x08f8ebc3afc32371d40ef59a951cb7b2da425159',
  [NETWORK.optimism_sepolia]: '0xe0D1033BAaB5FeE08ffCf3cB120Db953a60A05E4',
  [NETWORK.arbitrum_sepolia]: '0x8895efb4299bce2c7e4a5c434c49534bb357bdbc',
  [NETWORK.base_sepolia]: '0xf0346c7889061b29977e66034f284bfb5c761d29',
  [NETWORK.scroll_sepolia]: '0x8a37953461696882e728019EF77E3B84E0ece952',
  [NETWORK.gnosis_chiado]: '0xa056b44398fc07a7207372827d741bb914d08a5c'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0xa99b3a8503260ab32753c382eac297acd4a43908',
  [NETWORK.optimism]: '0x80F86691632d9863E6bCaa472e5c34574F77c7D1',
  [NETWORK.base]: '0x8557a9a33b573dc4403708c5a8746a52648374ea',
  [NETWORK.arbitrum]: '0x163402522fc0c0a7863479a069a8470fb22dfd3f',
  [NETWORK.scroll]: '0xf17d29f1c30da928bf98a73904681c12176de152',
  [NETWORK.gnosis]: '0xbddd23fdd9fe824d58814ca6d898af518676368a',
  [NETWORK.world]: '0x646c7a994e775cbe638ec91fd2625eea77df777e',
  [NETWORK.optimism_sepolia]: '0x966A8C9BC98c385C98751eCE749F3FB570890dd4',
  [NETWORK.arbitrum_sepolia]: '0xe098c4340329f0b0b72eb25e193a70eadb2499f7',
  [NETWORK.base_sepolia]: '0x6e4b2dd17a0b0db73f34a5edabda9ec22c70bce8',
  [NETWORK.scroll_sepolia]: '0x6d73bfB022B811C98EBEC8e8666273bAED005579',
  [NETWORK.gnosis_chiado]: '0x9fac7f093daa84bb4af85f8bdcfbd6a01a2ae1e3'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0x54aa02cbc223Fc834949FB1fd8C855e4dA126c7D',
  [NETWORK.optimism]: '0x220C9398b0Ee07472bF8906e44574Cb9FE3B8D90',
  [NETWORK.base]: '0xcdCE635b774DE77cdF791647601dba64a75547ba',
  [NETWORK.arbitrum]: '0xBEA38368f2A657f00f173764f18F00e841317c73',
  [NETWORK.scroll]: '0xb04d5c80a3f6da11532d3a67184bb7be11f00285',
  [NETWORK.gnosis]: '0x0cffb70cdd335cc5380cb58166699edaa2b0bbfa',
  [NETWORK.world]: '0x9035072fe640d5ef80edc41aef47b1a793809070',
  [NETWORK.optimism_sepolia]: '0xA6095e14Da0DFDC6C0C6C03715Fe613dcb3b3560',
  [NETWORK.arbitrum_sepolia]: '0x24ad9015e48951f74f33dc071af34a6db14e95d9',
  [NETWORK.base_sepolia]: '0xdc5e799a3e57f7642210feb9ebb0d1a38cf4fe84',
  [NETWORK.scroll_sepolia]: '0xDF0445868401a0eb1dA422eAd439cF87d365b88F',
  [NETWORK.gnosis_chiado]: '0x4002fb33de318a00e0e61c48eee492eb00ecef1b'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0x7c210be12bcef8090610914189a0de43e2192ea0',
  [NETWORK.optimism]: '0x7766b5E6839a1a218Fc861b0810C504490876136',
  [NETWORK.base]: '0xa9c937a0d1d22ad79099aea10efa62a270dfc22c',
  [NETWORK.arbitrum]: '0x7b4a60964994422bf19ae48a90fbff806767db73',
  [NETWORK.scroll]: '0x6f0b0ad2047f349594c8755ac080de9288d6ef7b',
  [NETWORK.gnosis]: '0x1664485e6b51ee1a4d4dd35dbec79544a5d006c9',
  [NETWORK.world]: '0xfde1b3202ae55349bd4fecd38ca886fd1ed38e62',
  [NETWORK.optimism_sepolia]: '0x3F4dA404973D2d7DDbFCFD05FFdE9361eE8895B1',
  [NETWORK.arbitrum_sepolia]: '0xb420f83c5936762e6fe0ceef16440df83479d3b7',
  [NETWORK.base_sepolia]: '0x86692766da4cca2f9581729d74da36d180643f8f',
  [NETWORK.scroll_sepolia]: '0xbc5b4D95c21AFA808E4954e8caE1C8aFe2202b1d',
  [NETWORK.gnosis_chiado]: '0x424a2beaafa2368700d30c7b3dd4aba89229e037'
}

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = {
  [NETWORK.mainnet]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-ethereum/v0.0.2/gn',
  [NETWORK.optimism]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-optimism/v0.0.4/gn',
  [NETWORK.base]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-base/v0.0.1/gn',
  [NETWORK.arbitrum]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-arbitrum-one/v0.0.1/gn',
  [NETWORK.scroll]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-scroll/v0.0.1/gn',
  [NETWORK.gnosis]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-gnosis/v0.0.1/gn',
  [NETWORK.world]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-world/v0.0.1/gn',
  [NETWORK.optimism_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
  [NETWORK.arbitrum_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-arbitrum-sepolia/version/latest',
  [NETWORK.base_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-base-sepolia/version/latest',
  [NETWORK.scroll_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-scroll-sepolia/version/latest',
  [NETWORK.gnosis_chiado]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-gnosis-chiado/version/latest'
} as const satisfies { [chainId: number]: `https://${string}` }

/**
 * Token Prices API URL
 */
export const TOKEN_PRICES_API_URL = `/api/tokenPrice`

/**
 * Networks supported by the price caching API
 */
export const TOKEN_PRICE_API_SUPPORTED_NETWORKS: NETWORK[] = [NETWORK.world]
// export const TOKEN_PRICE_API_SUPPORTED_NETWORKS: NETWORK[] = []

/**
 * Redirects for tokens without pricing data on the caching API
 */
export const TOKEN_PRICE_REDIRECTS: {
  [chainId: number]: {
    [address: Lowercase<Address>]: { chainId: number; address: Lowercase<Address> }
  }
} = {
  [NETWORK.gnosis_chiado]: {
    /* XDAI */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* WETH */
    '0x6b629bb304017d3d985d140599d8e6fc9942b9a7': {
      chainId: NETWORK.mainnet,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.mainnet]!
    },
    /* POOL */
    '0xa83a315bed18b36308a518c7f77a2464e9f7286c': {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    },
    /* USDC */
    '0xfc535b2407bb2c8b4f4a4faabbb9981ff031b7ca': {
      chainId: NETWORK.mainnet,
      address: USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
    },
    /* WXDAI */
    '0xb2d0d7ad1d4b2915390dc7053b9421f735a723e7': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* GUSD */
    '0xbe9a62939f82e12f4a48912078a4420f1a5fc2e0': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x3e9c64afc24c551cc8e11f52fedecdacf7362559': {
      chainId: NETWORK.mainnet,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    }
  }
}

/**
 * Redirects for offchain token rebrandings
 */
export const TOKEN_DATA_REDIRECTS: {
  [chainId: number]: { [address: Lowercase<Address>]: { name?: string; symbol?: string } }
} = {}

/**
 * Zap settings
 */
export const ZAP_SETTINGS: {
  [chainId: number]: { zapRouter: Address; zapTokenManager: Address }
} = {
  // [NETWORK.gnosis]: {
  //   zapRouter: '0x992Ccc9D9b8b76310E044660E96171116820F019',
  //   zapTokenManager: '0xA59BB0da9565e03f53AeFC94fcC205c52Fc925B7'
  // }
}

/**
 * Velodrome addresses
 */
export const VELODROME_ADDRESSES: {
  [chainId: number]: { router: Address; lpFactories: Lowercase<Address>[] }
} = {}

/**
 * Domains
 */
export const DOMAINS = {
  app: 'https://cabana-world-app.vercel.app',
  app_v4: 'https://app.pooltogether.com',
  landingPage: 'https://cabana.fi',
  protocolLandingPage: 'https://pooltogether.com',
  docs: 'https://docs.cabana.fi',
  protocolDocs: 'https://docs.pooltogether.com',
  protocolDevDocs: 'https://dev.pooltogether.com',
  governance: 'https://gov.pooltogether.com',
  poolExplorer: 'https://poolexplorer.win',
  tools_v4: 'https://tools.pooltogether.com',
  notion: 'https://pooltogetherdao.notion.site',
  vaultListCreator: 'https://lists.cabana.fi',
  vaultFactory: 'https://factory.cabana.fi',
  analytics: 'https://analytics.cabana.fi',
  swaps: 'https://swap.cabana.fi',
  rewardsBuilder: 'https://rewards.cabana.fi',
  flashLiquidator: 'https://flash.cabana.fi',
  migrations: 'https://migrate.cabana.fi',
  builders: 'https://builders.cabana.fi'
} as const satisfies { [name: string]: `https://${string}` }

/**
 * Links
 */
export const LINKS = {
  ...DOMAINS,
  termsOfService: `${DOMAINS.landingPage}/terms`,
  privacyPolicy: `${DOMAINS.landingPage}/privacy`,
  ecosystem: `${DOMAINS.protocolLandingPage}/ecosystem`,
  discord: `${DOMAINS.protocolLandingPage}/discord`,
  appDocs: `${DOMAINS.docs}/#the-cabana-app`,
  toolDocs: `${DOMAINS.docs}/#cabana-tools`,
  protocolBasicsDocs: `${DOMAINS.docs}/protocol/the-basics`,
  delegateDocs: `${DOMAINS.docs}/cabana-app/delegation`,
  prizeYieldDocs: `${DOMAINS.docs}/cabana-app/prize-yield`,
  factoryDocs: `${DOMAINS.docs}/cabana-tools/cabana-factory`,
  listDocs: `${DOMAINS.docs}/cabana-tools/cabana-lists`,
  analyticsDocs: `${DOMAINS.docs}/cabana-tools/cabanalytics`,
  swapDocs: `${DOMAINS.docs}/cabana-tools/cabana-swaps`,
  flashDocs: `${DOMAINS.docs}/cabana-tools/cabana-flash`,
  appGuides: `${DOMAINS.docs}/cabana-app/guides`,
  toolGuides: `${DOMAINS.docs}/cabana-tools/guides`,
  protocolFaqs: `${DOMAINS.docs}/protocol/faqs`,
  appFaqs: `${DOMAINS.docs}/cabana-app/faqs`,
  toolFaqs: `${DOMAINS.docs}/cabana-tools/faqs`,
  rewardTokenWhitelist: `${DOMAINS.docs}/cabana-app/bonus-rewards#reward-token-whitelist`,
  risks: `${DOMAINS.protocolDocs}/security/risks`,
  audits: `${DOMAINS.protocolDocs}/security/audits`,
  devDocs_v4: `${DOMAINS.protocolDevDocs}/protocol/V4/introduction`,
  depositDelegator: `${DOMAINS.tools_v4}/delegate`,
  prizeTierController: `${DOMAINS.tools_v4}/prize-tier-controller`,
  communityCalendar: `${DOMAINS.notion}/Community-Calendar-4ce3024241dd464db96215e6729a78e0`,
  brandKit: `https://www.figma.com/community/file/1212805243917604494`,
  twitter: `https://twitter.com/PoolTogether_`,
  github: `https://github.com/orgs/GenerationSoftware/repositories?q=pooltogether+sort%3Astars`,
  medium: `https://medium.com/pooltogether`,
  tally: `https://www.tally.xyz/gov/pooltogether`,
  treasury: `https://info.pooltogether.com/treasury`,
  dune_v4: `https://dune.com/sarfang/PoolTogetherV4`,
  grants: `https://poolgrants.org`,
  hey: `https://hey.xyz/u/pooltogether`,
  mirror: `https://pooltogether.mirror.xyz/`,
  warpcast: `https://warpcast.com/~/channel/pool-together`,
  clientJs: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js`,
  clientJs_v4: `https://www.npmjs.com/package/@pooltogether/v4-client-js`,
  reactHooks: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks`
} as const satisfies { [name: string]: `https://${string}` }

/**
 * Block explorer mapping
 */
export const BLOCK_EXPLORERS: Record<number, { name: string; url: string }> = {
  [NETWORK.gnosis_chiado]: { name: 'Gnosisscan', url: 'https://gnosis-chiado.blockscout.com/' },
  [NETWORK.world]: { name: 'Worldscan', url: 'https://worldscan.org/' }
}

/**
 * CoinGecko API URL
 */
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

/**
 * CoinGecko platform IDs
 */
export const COINGECKO_PLATFORMS = {
  [NETWORK.gnosis_chiado]: 'xdai',
  [NETWORK.world]: 'world-chain'
} as const
export type COINGECKO_PLATFORM = keyof typeof COINGECKO_PLATFORMS

/**
 * CoinGecko native token IDs
 */
export const COINGECKO_NATIVE_TOKEN_IDS: Record<number, string> = {
  [NETWORK.gnosis_chiado]: 'xdai',
  [NETWORK.world]: 'world-chain'
}

/**
 * Second constants
 */
export const SECONDS_PER_MINUTE = 60
export const SECONDS_PER_HOUR = 3_600
export const SECONDS_PER_DAY = 86_400
export const SECONDS_PER_WEEK = 604_800
export const SECONDS_PER_MONTH = 2_628_000
export const SECONDS_PER_YEAR = 31_536_000

/**
 * Minute constants
 */
export const MINUTES_PER_HOUR = 60
export const MINUTES_PER_DAY = 1_440

/**
 * Max uint256 value
 */
export const MAX_UINT_256 = 2n ** 256n - 1n

/**
 * Max uint96 value
 */
export const MAX_UINT_96 = 2n ** 96n - 1n

/**
 * EIP2612 Permit Types
 */
export const EIP2612_PERMIT_TYPES = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const

/**
 * Old DAI Permit Types
 */
export const OLD_DAI_PERMIT_TYPES = {
  Permit: [
    { name: 'holder', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
    { name: 'allowed', type: 'bool' }
  ]
} as const
