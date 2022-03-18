import { CryptoAddress } from '../shared/SharedTypes';
import { loadTokenContract } from './LMTelos';

export async function airdrop50ToUser(address: CryptoAddress) {
  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return -1;
  }

  const contract = await loadTokenContract();
  await contract.userAirdrop50(address);
}