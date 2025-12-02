'use client';

import { ReactQueryProvider } from '@/components/react-query-provider';
import { privyConfig } from '@/configs/privy';
import { wagmiConfig } from '@/configs/wagmi';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { Provider as JotaiProvider } from 'jotai';
import theme from './theme';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={privyConfig}
      >
        <ReactQueryProvider>
          <WagmiProvider config={wagmiConfig}>
            <StyledEngineProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
              </ThemeProvider>
            </StyledEngineProvider>
          </WagmiProvider>
        </ReactQueryProvider>
      </PrivyProvider>
    </JotaiProvider>
  );
}
