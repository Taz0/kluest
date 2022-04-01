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
  await contract.chestReward(address, amount, { gasLimit: 3000000 });
}

export async function purchaseItem(
  address: CryptoAddress,
  itemIdStr: string,
  amountMilliKtts: number,
  contractAddress: CryptoAddress
) {
  const contract = await loadTokenContract(contractAddress);
  const itemId = BigNumber.from(itemIdStr);
  await contract.purchaseItem(address, itemId, amountMilliKtts, { gasLimit: 3000000 });
}

export async function rewardItem(itemIdStr: string, address: CryptoAddress, contractAddress: CryptoAddress): Promise<number> {
  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return -1;
  }

  const contract = await loadTokenContract(contractAddress);
  const itemId = BigNumber.from(itemIdStr);
  return await contract.rewardItem(itemId, address);
}

export async function convertTLOStoKTTs(address: CryptoAddress, contractAddress: CryptoAddress) {
  const contract = await loadTokenContract(contractAddress);
  console.log(`Converting TLOS to KTTs of ${address} with contract ${contractAddress}`);
  await contract.convertTLOStoKTTs(address, { gasLimit: 3000000 });
}

export async function userItems(address: CryptoAddress, contractAddress: CryptoAddress): Promise<string[]> {
  const contract = await loadTokenContract(contractAddress);
  console.log(`Getting user items from user ${address} with contract ${contractAddress}`);
  const items = await contract.userItems(address, { gasLimit: 3000000 });
  return items.map((item: BigNumber) => item.toString());
}