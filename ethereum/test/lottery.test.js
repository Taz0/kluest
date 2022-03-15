const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts;
let contract;

const minimumParticipation = 100;
const contractArguments = [minimumParticipation];

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: contractArguments })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("has been created with a minimum of participation", async () => {
    const minParticipation = await contract.methods
      .minimumParticipation()
      .call();
    assert.equal(minParticipation, minimumParticipation);
  });

  it("the manager cannot participate in the lottery", async () => {
    const manager = accounts[0];
    try {
      await contract.methods
        .enter()
        .send({ from: manager, value: minimumParticipation });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("can participate paying the minimum fee", async () => {
    const money = minimumParticipation;
    const participant = accounts[1];
    const trans = await contract.methods
      .enter()
      .send({ from: participant, value: money });
    assert(trans);
  });

  it("cannot participate without paying the minimum fee", async () => {
    const money = minimumParticipation - 1;
    const participant = accounts[1];
    try {
      await contract.methods.enter().send({ from: participant, value: money });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("cannot participate more than once", async () => {
    const participant = accounts[1];
    await contract.methods.enter().send({ from: participant, value: minimumParticipation });
    assert(true);
    try {
      await contract.methods.enter().send({ from: participant, value: minimumParticipation });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("the number of players is increased when someone enters", async () => {
    const playersBefore = await contract.methods.getPlayers().call();
    const money = minimumParticipation;
    const participant = accounts[1];
    await contract.methods.enter().send({ from: participant, value: money });
    const playersAfter = await contract.methods.getPlayers().call();
    console.log(`Before ${playersBefore}, after: ${playersAfter}`);

    assert(playersBefore.length + 1 === playersAfter.length);
  });
});
