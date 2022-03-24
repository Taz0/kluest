import { BigNumber } from 'ethers';
import { CryptoAddress } from '../shared/SharedTypes';
import { loadTokenContract } from './LMContract';

export async function airdrop50ToUser(address: CryptoAddress) {
  const contract = await loadTokenContract();
  await contract.userAirdrop50(address);
}

export async function userBuyItem(address: CryptoAddress, item: string, amount: string) {
  const contract = await loadTokenContract();
  const amountNumber = BigNumber.from(amount);
  await contract.userBuyItem(address, item, amountNumber);
}