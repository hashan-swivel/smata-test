import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import Cookie from 'js-cookie';
import * as Sentry from '@sentry/browser';
import { sentryInit } from '@/utils/sentry';
import { hotjarInit } from '@/utils/hotjar';
import { retrieveUser, redirectToLogin } from '@/actions/auth';
import { invitationTokenActions } from '@/actions';

import store from '@/utils/store';

import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.scss'

sentryInit();

const _App = withRedux(store)(
  class _App extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
        pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
      };
    }

    componentDidCatch(error, errorInfo) {
      if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
          Object.keys(errorInfo).forEach((key) => {
            scope.setExtra(key, errorInfo[key]);
          });
          Sentry.captureException(error);
        });
        super.componentDidCatch(error, errorInfo);
      }
    }

    componentDidMount() {
      hotjarInit();
      this.handlePathChange();
    }

    componentDidUpdate(prevProps) {
      const { router } = this.props;
      const { router: oldRouter } = prevProps;

      const pathname = router && router.pathname;
      const oldPathname = oldRouter && oldRouter.pathname;

      if (pathname !== oldPathname) {
        this.handlePathChange();
      }
    }

    handlePathChange = async () => {
      const { store: state, router } = this.props;
      const token = Cookie.get('access_token');

      if (token) {
        const sessionStorageUser = sessionStorage.getItem('user');
        const sessionStorageToken = sessionStorage.getItem('access_token');
        const stateCurrentUser = state.getState()?.auth?.currentUser;

        if (
          !sessionStorageToken ||
          sessionStorageToken !== token ||
          sessionStorageUser !== JSON.stringify(stateCurrentUser)
        ) {
          state.dispatch(retrieveUser());
        } else {
          // fetch building session
        }
      } else {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');

        const publicRoutes = ['/', '/login', '/register'];

        if (!publicRoutes.includes(router.pathname)) {
          state.dispatch(redirectToLogin());
        }

        if (router.pathname === '/register' && router.query?.invitation_token) {
          state.dispatch(invitationTokenActions.getInvitationToken(router.query?.invitation_token));
        }
      }
    };

    render() {
      const { Component, pageProps, store: state } = this.props;
      const getLayout = Component.getLayout || ((page) => page);

      return <Provider store={state}>{getLayout(<Component {...pageProps} />)}</Provider>;
    }
  }
);

export default _App;
