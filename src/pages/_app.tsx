import createEmotionCache from '@/core/createEmotionCache';
import theme from '@/core/theme';
import { AppPropsWithLayout } from '@/types';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import '@/styles/global.css';
import { SnackbarProvider } from 'notistack';
import { SnackBarProviderConfig } from '@/config/snackbar-config';
import { swrConfig } from '@/config/swr-config';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SWRConfig value={swrConfig}>
            <SnackbarProvider {...SnackBarProviderConfig} />
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </SWRConfig>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
