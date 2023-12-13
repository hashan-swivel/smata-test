import * as Sentry from '@sentry/browser';

export const sentryInit = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.ENV_NAME,
      beforeSend: (event, hint) => {
        if (hint) {
          const error = hint.originalException;
          let errorMessage;

          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          if (errorMessage) {
            switch (errorMessage) {
              case (errorMessage.match(/Request failed with status code/i) || {}).input:
                return null;
              case (errorMessage.match(/Request aborted/i) || {}).input:
                return null;
              default:
                break;
            }
          }
        }

        return event;
      }
    });
  }
};
