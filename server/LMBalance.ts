import { ethers } from 'ethers'
import { CryptoAddress } from '../shared/SharedTypes';
import { loadContract } from './LMContract';
import _ from 'lodash';

export interface Balance {
  name: string,
  address: CryptoAddress,
  balance?: number
}

enum NFT_IDs{
  KTT = 0
}

export async function getTokenBalance(address: CryptoAddress, contractAddress: CryptoAddress): Promise<number> {
  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return -1;
  }

  const contract = await loadContract(contractAddress);
  const balance = await contract.balanceOf(address, NFT_IDs.KTT);
  const etherDecimals = Number.parseFloat(ethers.utils.formatEther(balance));
  const amount = Number.parseFloat(etherDecimals.toFixed(6));

  return amount;
}

export async function getTelosBalance(address: CryptoAddress): Promise<number> {
  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return -1;
  }

  // const providerRinkeby = providers.getDefaultProvider('rinkeby');
  const providers = ethers.providers;
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new providers.JsonRpcProvider(telosRPCDevNet);

  const balance = await providerTelos.getBalance(address);
  const etherDecimals = Number.parseFloat(ethers.utils.formatEther(balance));
  const amount = Number.parseFloat(etherDecimals.toFixed(6));

  return amount;
}

// Move this to testing
// const accounts: Balance[] = [
//   {
//     name: 'David1',
//     address: '0xD8Ff420622449bfFa9C1284004a5D50b7b2e637F'
//   },
//   {
//     name: 'David2',
//     address: '0xF0deCE36Aa5D5702e1a1d6986854774011095EA0'
//   },
//   {
//     name: 'Juan1',
//     address: '0xD6B5aEccfDc3565a993f8cBbCdE99E0cCdA2A68d'
//   },
//   {
//     name: 'Alberto1',
//     address: '0x6566C67ef9ef99efad51eee4f2B7f04FA90dA394'
//   },
//   {
//     name: 'Jose1',
//     address: '0x885A5f25ad52902f42526A442Beb58cD3eAF0b84'
//   }
// ];

// export async function checkBalances(): Promise<Balance[]> {

//   if (typeof window !== "undefined") {
//     console.log(`Running in browser bye bye`);
//     return [];
//   }

//   // const providerRinkeby = providers.getDefaultProvider('rinkeby');
//   const providers = ethers.providers;
//   const telosRPCDevNet = "https://testnet.telos.net/evm";
//   const providerTelos = new providers.JsonRpcProvider(telosRPCDevNet);

//   accounts.forEach(async account => {
//     const balance = await providerTelos.getBalance(account.address);
//     const etherDecimals = Number.parseFloat(ethers.utils.formatEther(balance));
//     account.balance = Number.parseFloat(etherDecimals.toFixed(6));
//     console.log(`Balance de ${account.name} es ${etherDecimals}`);
//   });

//   return accounts;
// }