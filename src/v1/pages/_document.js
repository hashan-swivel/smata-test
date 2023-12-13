import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as Sentry from '@sentry/browser';

process.on('unhandledRejection', (err) => {
  if (process.env.SENTRY_DSN) Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  if (process.env.SENTRY_DSN) Sentry.captureException(err);
});

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className='body'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
