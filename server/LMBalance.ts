import { ethers } from 'ethers';
import { CryptoAddress } from '../shared/SharedTypes';
import _ from 'lodash';

export interface Balance {
  name: string,
  address: CryptoAddress,
  balance?: number;
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
