import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { deriveSponsorWalletAddress, deriveAirnodeXpub } from '@api3/airnode-admin';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { getDeployedContracts } from "zksync-web3/build/src/utils";
const HDWallet = require('ethereum-hdwallet')

// const evm = require('../src/evm');
// const util = require('../src/util');
// const parameters = require('../src/parameters');

const Web3 = require("web3");
// airnodeAbiJson = INSERT_ABO_HERE
const web3 = new Web3('https://zksync2-testnet.zksync.dev');

export default async function (hre: HardhatRuntimeEnvironment) {

    const rrpAddress = "0xbD5263fa8c93Deb3417d49E63b444cBd541922FD";
    const _rrpContract = hre.artifacts.readArtifactSync("AirnodeRrpV0")
    const rrpContract = new ethers.Contract(rrpAddress, _rrpContract.abi);

var airnodeContract = new web3.eth.Contract(_rrpContract.abi, '0xbD5263fa8c93Deb3417d49E63b444cBd541922FD');


async function main() {
  // const coinId = 'ethereum';
  // const wallet = await evm.getWallet();
  // const exampleClient = new ethers.Contract(
  //   util.readFromLogJson('ExampleClient address'),
  //   evm.ExampleClientArtifact.abi,
  //   wallet
  // );
  // const airnode = await evm.getAirnode();

  // console.log('Making the request...');
  // async function makeRequest() {
  //   const receipt = await exampleClient.makeRequest(
  //     parameters.providerId,
  //     parameters.endpointId,
  //     util.readFromLogJson('Requester index'),
  //     util.readFromLogJson('Designated wallet address'),
  //     airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: coinId }])
  //   );
  //   return new Promise((resolve) =>
  //     wallet.provider.once(receipt.hash, (tx) => {
  //       const parsedLog = airnode.interface.parseLog(tx.logs[0]);
  //               resolve(parsedLog.args.requestId);
  //     })
  //   );
  // }
//  const requestId = await makeRequest();
//  console.log(`Made the request with ID ${requestId}.\nWaiting for it to be fulfilled...`);

  // function fulfilled(requestId) {
  //   return new Promise((resolve) =>
  //     wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
  //   );
  // }
//  await fulfilled(requestId);
var i;
        var END_BLOCK =  await web3.eth.getBlockNumber();
for (i = 0; i < 1; i++) {

   console.log(END_BLOCK);
      const events = await airnodeContract.events.allEvents("AllEvents",
                    {

              fromBlock: END_BLOCK -1000,

                   toBlock: END_BLOCK});
        //              console.log(events[0]);
        //
        END_BLOCK = END_BLOCK - 1000;
                                      console.log(events);
}
//  console.log('Request fulfilled');
//      const requestId = '0x7d3d5dc246040d62a917ee5e7cb26e3fcb901fb821f92a09c694171c9cd840ab';
//  console.log(`${coinId} price is ${(await exampleClient.fulfilledData(requestId)) / 1e6} USD`);
}
// console.log(airnodeContract.events.allEvents())

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
}