import { ethers } from 'ethers'
import { CryptoAddress } from '../shared/SharedTypes';
import fs from "fs-extra";
import path from "path";
import _ from 'lodash';

type EthersProvider = ethers.providers.Provider;

export async function loadTokenContract(contractAddress: CryptoAddress): Promise<any> {  
  const abi = loadAbi('KluestToken');
  // const provider = getProvider();
  const account = getAccount();
  const tokenContract = contractAddress || process.env.TOKEN_CONTRACT as CryptoAddress;
  if (!_.isString(tokenContract)){
    throw new Error("No token contract address has been defined!");
  }
  const contract = new ethers.Contract(tokenContract, abi, account);
  const name = await contract.name();
  console.log(`Contract ${name} loaded from ${tokenContract}`);
  return contract;
}

export async function loadNFTContract(): Promise<any> {
  const abi = loadAbi('KluestNFT');
  // const provider = getProvider();
  const account = getAccount();
  const nftContract = process.env.NFT_CONTRACT as CryptoAddress;
  if (!_.isString(nftContract)) {
    throw new Error("No nft contract address has been defined!");
  }
  const contract = new ethers.Contract(nftContract, abi, account);
  const name = await contract.name();
  console.log(`Contract ${name} loaded from ${nftContract}`);
  return contract;
}

export async function loadContract(address: CryptoAddress, abiFilename?: string): Promise<any> {
  const abi = loadAbi(abiFilename || 'KluestToken');
  const provider = getProvider();
  const contract = new ethers.Contract(address, abi, provider);
  const name = await contract.name();
  console.log(`Contract ${name} loaded from ${address}`);
  return contract;
}

function getProvider(): EthersProvider {
  const providers = ethers.providers;
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  return new providers.JsonRpcProvider(telosRPCDevNet);
}

function loadAbi(filename: string): any {
  const buildFolder = path.resolve(process.cwd(), "ethereum", "build");
  const abiPath = path.resolve(buildFolder, filename + ".abi");
  return fs.readJsonSync(abiPath);
}

function getAccount() {
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new ethers.providers.JsonRpcProvider(telosRPCDevNet);
  const mnemonic = process.env.MNEMONIC;
  if (!_.isString(mnemonic)) {
    console.error("mnemonic was not defined!");
    throw new Error("mnemonic was not defined!")
  } else {
    console.log(`mnemonic: ${mnemonic.substring(0, 5)}...`);
  }
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return wallet.connect(providerTelos);
}
