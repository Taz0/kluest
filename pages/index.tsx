import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Home.module.css';
import UIAirDrop from './UIAirdrop';
import UIContractSelector from './UIContractSelector';
import UIChestReward from './UIChestReward';
import UIUserItems from './UIUserItems';
import UIRewardItem from './UIRewardItem';
import UIItemBalance from './UIItemBalance';

const Home: NextPage = (props) => {

  const [contractAddress, setContractAddress] = useState(process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || 'no default contract found!');

  return (
    <div className={styles.container}>
      <Head>
        <title>Kluest Crypto Test Panel</title>
        <meta name="description" content="Kluest!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://kluest.com/">Kluest</a>
        </h1>
        <h2>Telos EVM Test Panel</h2>

        <hr />
        <UIContractSelector defaultContractAddress={contractAddress}
          setContractAddress={setContractAddress} />
        <hr />
        <UIItemBalance contractAddress={contractAddress} />
        <hr />
        <UIAirDrop contractAddress={contractAddress} />
        <hr />
        <UIChestReward contractAddress={contractAddress} />
        <hr />
        <UIRewardItem contractAddress={contractAddress} />
        <hr />
        <UIUserItems contractAddress={contractAddress} />
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
  );
};

export default Home;
