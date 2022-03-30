import { BigNumber } from 'ethers';
import { CryptoAddress } from '../shared/SharedTypes';
import { loadTokenContract } from './LMContract';

export async function initialAirdrop(address: CryptoAddress, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  console.log(`Initial airdrop to ${address} with contract ${contractAddress}`);
  await contract.initialAirdrop(address, { gasLimit: 3000000 });
}

export async function chestReward(address: CryptoAddress, amount: number, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  console.log(`Chest Reward of ${amount} to ${address} with contract ${contractAddress}`);
  await contract.chestReward(address, amount, {gasLimit: 3000000});
}

export async function userBuyItem(address: CryptoAddress, item: string, amount: string, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  const amountNumber = BigNumber.from(amount);
  await contract.userBuyItem(address, item, amountNumber, { gasLimit: 3000000 });
}