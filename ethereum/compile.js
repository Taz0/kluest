const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const _ = require("lodash");


function compile(contractName) {
  const filename = contractName + ".sol";
  const contractPath = path.resolve(__dirname, "contracts", filename);
  const source = fs.readFileSync(contractPath, "utf8");

  console.log(`Compiling ${contractName}...`);

  const input = {
    language: "Solidity",
    sources: { [filename]: { content: source, }, },
    settings: { outputSelection: { "*": { "*": ["*"], }, }, },
  };

  solc.compile
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (!output.contracts) {
    console.error(`Error compiling ${contractName}:\n${JSON.stringify(output, null, ' ')}`);
  }  
  const contracts = output.contracts[filename];
  if (_.isUndefined(contracts)) {
    console.error(`Contracts were not generated`);
    return;
  }

  const buildPath = path.resolve(__dirname, "build");
  fs.removeSync(buildPath);
  fs.ensureDirSync(buildPath);

  for (let contractName in contracts) {
    const outputFile = path.resolve(buildPath, contractName + ".abi.json");
    const abi = contracts[contractName].abi;
    fs.outputJsonSync(outputFile, abi);
  }
  console.log(`  Finished! ✅`);
}

compile(process.argv.slice(2)[0]);
