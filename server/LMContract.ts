import { ethers } from 'ethers'
import { CryptoAddress } from '../shared/SharedTypes';
import { loadContract } from './LMTelos';

export async function contract(address: CryptoAddress): Promise<Boolean> {

  if (typeof window !== "undefined") {
    console.error(`Running in browser bye bye 👋`);
    return false;
  }

  try {
    const contract = await loadContract(address, 'TokenERC20');
    console.log(`Contract loaded!`);
    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    console.log(`token loaded ${tokenName} ${tokenSymbol}`);
  } catch (error) {
    return false;
  }
  
  return true;
}
