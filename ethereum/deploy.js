const { ethers } = require('ethers');
const fs = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");
const dotenvPath = path.resolve(__dirname, ".env.development.local");
dotenv.config({ path: dotenvPath });

const buildFolder = path.resolve(process.cwd(), "ethereum", "build");

async function deployContract(contractName, contractArguments) {
  const abi = loadAbi(contractName);
  if (!abi) { console.error(`Error reading abi file ${abiPath}`); return flase; }

  const bytecode = loadBytecode(contractName);
  if (!bytecode) { console.error(`Error reading bytecode file ${bytecodePath}`); return false; }

  const account = loadAccount();
  const factory = new ethers.ContractFactory(abi, bytecode, account);

  // Deploy, setting total supply to 100 tokens (assigned to the deployer)
  await executeDeployment(factory, contractArguments);
}

function loadAbi(contractName) {
  const abiPath = path.resolve(buildFolder, contractName + ".abi");
  return fs.readJsonSync(abiPath);
}

function loadBytecode(contractName) {
  const bytecodePath = path.resolve(buildFolder, contractName + ".bin");
  return fs.readFileSync(bytecodePath).toString();
}

function loadAccount() {
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new ethers.providers.JsonRpcProvider(telosRPCDevNet);
  console.log(`Using mnemonic ${process.env.MNEMONIC.substring(0, 5)}`);
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  const account = wallet.connect(providerTelos);
  return account;
}

async function executeDeployment(factory, contractArguments) {

  console.dir(contractArguments);

  const contract = await factory.deploy(...contractArguments);
  const deployTransaction = await contract.deployTransaction.wait();

  process.stdout.write("Contract info: "); console.dir(contract);
  process.stdout.write("\nTransaction info: "); console.dir(deployTransaction);
  console.log("\n\n-- Contract deployed to", contract.address, "--");

  return contract;
}

const argContractName = process.argv.slice(2)[0];
const argCreationArguments = process.argv.slice(3);

console.log(`Deploying ${argContractName} with ${argCreationArguments}`);
deployContract(argContractName, argCreationArguments);