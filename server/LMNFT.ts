import { CryptoAddress } from '../shared/SharedTypes';
import { loadNFTContract } from './LMContract';

export async function giveItemUriToUser(address: CryptoAddress, uri: string): Promise<number> {
  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return -1;
  }

  const contract = await loadNFTContract();  
  return await contract.giveItem(address, uri);
}