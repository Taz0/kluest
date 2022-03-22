import '../styles/application.scss'
import type { AppProps } from 'next/app'

if (typeof window === undefined) {
  console.log(`Working with contract at address ${process.env.NEXT_PUBLIC_TOKEN_CONTRACT}`);
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
