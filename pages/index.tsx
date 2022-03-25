import { BigNumber } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import UIAirDrop from './UIAirdrop'
import UIBalance from './UIBalance'
import UIContractSelector from './UIContractSelector'
import { useState } from 'react'


const Home: NextPage = () => {

  const [contractAddress, setContractAddress] = useState("0x110Ba5f1A7b32E1B23183662C93b4F460d87688C")

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Kluest!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://kluest.com/">Kluest</a>
        </h1>
        <h2>Telos EVM Test Panel</h2>

        <hr/>
        <UIContractSelector defaultContractAddress={contractAddress}
         setContractAddress={setContractAddress}/>
        <hr />
        <UIBalance contractAddress={contractAddress}/>
        <hr />
        <UIAirDrop contractAddress={contractAddress} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
