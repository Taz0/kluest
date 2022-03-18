import { ethers } from 'ethers'
import { CryptoAddress } from '../shared/SharedTypes';
import fs from "fs-extra";
import path from "path";

type EthersProvider = ethers.providers.Provider;

///TODO: Add return types to typescript
export function getProvider(): EthersProvider {
  const providers = ethers.providers;
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new providers.JsonRpcProvider(telosRPCDevNet);
  return providerTelos;
}

export async function loadContract(address: CryptoAddress, abiFilename?: string): Promise<any> {
  const abi = loadAbi(abiFilename || 'TokenERC20');
  const provider = getProvider();
  const contract = new ethers.Contract(address, abi, provider);
  const name = await contract.name();
  console.log(`Contract ${name} loaded`);
  return contract;
}

function loadAbi(filename: string): any {
  const buildFolder = path.resolve(process.cwd(), "ethereum", "build");
  const abiPath = path.resolve(buildFolder, filename + ".abi");
  return fs.readJsonSync(abiPath);
}