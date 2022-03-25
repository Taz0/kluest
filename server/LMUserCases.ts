import { BigNumber } from 'ethers';
import { CryptoAddress } from '../shared/SharedTypes';
import { loadTokenContract } from './LMContract';

export async function airdrop50ToUser(address: CryptoAddress, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  await contract.userAirdrop50(address);
}

export async function userBuyItem(address: CryptoAddress, item: string, amount: string, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  const amountNumber = BigNumber.from(amount);
  await contract.userBuyItem(address, item, amountNumber);
}