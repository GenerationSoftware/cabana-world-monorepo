import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import App from 'next/app'
import { WagmiProvider } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { SUPPORTED_NETWORKS } from '@constants/config'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

const queryClient = new QueryClient()

const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]
const wagmiConfig = createCustomWagmiConfig(networks)

export default function MyApp(props: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <AppContainer {...props} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

MyApp.getInitialProps = async (appCtx: AppContext): Promise<AppInitialProps> => {
  const initialProps = await App.getInitialProps(appCtx)

  return { ...initialProps }
}
