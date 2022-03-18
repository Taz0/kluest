import '../styles/application.scss'
import type { AppProps } from 'next/app'

console.log(`Working with contract at address ${process.env.ENV_TOKEN_CONTRACT}`);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
