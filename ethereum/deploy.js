const { ethers } = require('ethers');
const fs = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");

async function deployContract(contractName, contractArguments) {
  const abi = loadAbi(contractName);
  if (!abi) { console.error(`Error reading abi file ${abiPath}`); return flase; }

  const bytecode = loadBytecode(contractName);
  if (!bytecode) { console.error(`Error reading bytecode file ${bytecodePath}`); return false; }

  const account = loadAccount();
  const factory = new ethers.ContractFactory(abi, bytecode, account);

  // Deploy, setting total supply to 100 tokens (assigned to the deployer)
  return await executeDeployment(factory, contractArguments);
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

// Load command arguments: npm run deploy dev|prod contractName contractArguments
const argEnvMode = process.argv.slice(2)[0];
const argContractName = process.argv.slice(3)[0];
const argCreationArguments = process.argv.slice(4);

const envFilename = argEnvMode === "prod" ? ".env.production.local" : ".env.development.local";
const dotenvPath = path.resolve(__dirname, `../${envFilename}`);
dotenv.config({ path: dotenvPath });

const buildFolder = path.resolve(process.cwd(), "public");

console.log(`Deploying in ${argEnvMode} ${argContractName} with ${argCreationArguments}`);
deployContract(argContractName, argCreationArguments);

console.log(`Copying abi ${argContractName}.abi to public folder`);
const publicFolder = path.resolve(process.cwd(), "public");
fs.copyFileSync(path.resolve(buildFolder, argContractName + ".abi"), path.resolve(publicFolder, argContractName + ".abi"));
