import { ethers } from 'ethers'

export interface Balance {
  name: string,
  address: string,
  balance?: number
}

const accounts: Balance[] = [
  {
    name: 'David1',
    address: '0xD8Ff420622449bfFa9C1284004a5D50b7b2e637F'
  },
  {
    name: 'David2',
    address: '0xF0deCE36Aa5D5702e1a1d6986854774011095EA0'
  },
  {
    name: 'Juan1',
    address: '0xD6B5aEccfDc3565a993f8cBbCdE99E0cCdA2A68d'
  },
  {
    name: 'Alberto1',
    address: '0x6566C67ef9ef99efad51eee4f2B7f04FA90dA394'
  },
  {
    name: 'Jose1',
    address: '0x885A5f25ad52902f42526A442Beb58cD3eAF0b84'
  }
];

export async function checkBalances(): Promise<Balance[]> {

  if (typeof window !== "undefined") {
    console.log(`Running in browser bye bye`);
    return [];
  }

  // const providerRinkeby = providers.getDefaultProvider('rinkeby');
  const providers = ethers.providers;
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new providers.JsonRpcProvider(telosRPCDevNet);

  accounts.forEach(async account => {
    const balance = await providerTelos.getBalance(account.address);
    const etherDecimals = Number.parseFloat(ethers.utils.formatEther(balance));
    account.balance = Number.parseFloat(etherDecimals.toFixed(6));
    console.log(`Balance de ${account.name} es ${etherDecimals}`);
  });

  return accounts;
}
