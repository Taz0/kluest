const { ethers } = require('ethers');
const fs = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");
const dotenvPath = path.resolve(__dirname, ".env.local");
dotenv.config({ path: dotenvPath });

const contractArguments = [1];

async function deployContract(contractName) {
  const abi = loadAbi(contractName);
  if (!abi) { console.error(`Error reading abi file ${abiPath}`); return flase; }

  const bytecode = loadBytecode(contractName);
  if (!bytecode) { console.error(`Error reading bytecode file ${bytecodePath}`); return false; }

  const account = loadAccount();
  const factory = new ethers.ContractFactory(abi, bytecode, account);

  // Deploy, setting total supply to 100 tokens (assigned to the deployer)
  const contract = await executeDeployment(factory, contractArguments);  

  const participation = await contract.participation();
  console.log(`Participation is ${participation}`);
}

function loadAbi(contractName) {
  const buildFolder = path.resolve(process.cwd(), "bin/ethereum/contracts");
  const abiPath = path.resolve(buildFolder, contractName + ".abi");
  const abi = fs.readJsonSync(abiPath);
  return abi;
}

function loadBytecode(contractName) {
  const buildFolder = path.resolve(process.cwd(), "bin/ethereum/contracts");
  const bytecodePath = path.resolve(buildFolder, contractName + ".bin");
  const bytecode = fs.readFileSync(bytecodePath).toString();
  return bytecode;
}

function loadAccount() {
  const telosRPCDevNet = "https://testnet.telos.net/evm";
  const providerTelos = new ethers.providers.JsonRpcProvider(telosRPCDevNet);
  const wallet = ethers.Wallet.fromMnemonic(process.env.DEV_MNEMONIC);
  const account = wallet.connect(providerTelos);
  process.stdout.write("Account: "); console.dir(account);
  return account;
}

async function executeDeployment(factory, contractArguments) {
  const contract = await factory.deploy(contractArguments);
  const deployTransaction = await contract.deployTransaction.wait();

  process.stdout.write("Contract info: "); console.dir(contract);
  process.stdout.write("\nTransaction info: "); console.dir(deployTransaction);
  console.log("\n\n-- Contract deployed to", contract.address, "--");

  return contract;
}

deployContract(process.argv.slice(2)[0]);
