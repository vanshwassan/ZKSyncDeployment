import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { deriveSponsorWalletAddress, deriveAirnodeXpub } from '@api3/airnode-admin';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { getDeployedContracts } from "zksync-web3/build/src/utils";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";


// An example that will call the Requester Contract and will make a full request

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the Requester contract`);
    const rrpAddress = "0xbD5263fa8c93Deb3417d49E63b444cBd541922FD";

// Initialize the wallet.
    const wallet = new Wallet("<pvt-key>");
  
// Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);
    const requesterArtifact = await deployer.loadArtifact("Requester");
    const airnodeRRP = await deployer.loadArtifact("AirnodeRrpV0");


  const requesterContract = await deployer.deploy(requesterArtifact, [rrpAddress]);
  const requesterAddress = requesterContract.address;
  // const rrpContract = new Contract();
  console.log(`${requesterArtifact.contractName} was deployed to ${requesterAddress}`);

  const airnode = "0x6A7F359d025aE2ebdC36E594F633b39a02Bfe88C"
    const sponsor = requesterAddress;
    const endpointId = "0xfd19ee2c054da313208b4a6106c336286fc6a9f72dd5d0bc8619c018c384c74a";
    const airnodeXpub = "xpub6DUz9nJVxJpVieSaBesGdwRgdznuPe875cczeg6HE1RoN7Hzm9Dsty8i8T5h4ZQzm4ShkwCkT2VXwnJETQH4XjGHY6bbKdqypLin7wrxoHY";
    const sponsorWalletAddress = deriveSponsorWalletAddress(airnodeXpub, airnode, sponsor);
    const encodedParams = "0x315353535353000000000000000000000000000000000000000000000000000071756572790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160737562677261706800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002006170695f6b65790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002605f7061746800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a05f7479706500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000627b6d61726b6574706c616365732866697273743a203529207b6964206e616d6520736c7567206e6574776f726b7d20636f6c6c656374696f6e732866697273743a203529207b6964206e616d652073796d626f6c20746f74616c537570706c797d7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c41776f78455a6269574c7676366533516476644d5a773457445552644762765066486d5a5263384470667a39000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000203837626165376336663163323665373932303966383635326337343566666162000000000000000000000000000000000000000000000000000000000000001e646174612e636f6c6c656374696f6e732e322e746f74616c537570706c7900000000000000000000000000000000000000000000000000000000000000000006696e743235360000000000000000000000000000000000000000000000000000";
    console.log(`Sponsor Wallet Address: ${sponsorWalletAddress}`);  
// send funds to the sponsor wallet
    const depositAmount = ethers.utils.parseEther("0.1");
    const depositHandle = await deployer.zkWallet.deposit({
    to: sponsorWalletAddress,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
    console.log(`Depositing ${depositAmount} to ${sponsorWalletAddress}`);
// Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log(`Making a request...`)
// make the request
    const receipt = await requesterContract.makeRequest(
        airnode,
        endpointId,
        sponsor,
        sponsorWalletAddress,
        encodedParams
    );

    // console.log(receipt)

    await new Promise((resolve) =>
    ethers.getDefaultProvider().once(receipt.hash, (tx) => {
      const parsedLog = airnodeRRP.interface.parseLog(tx.logs[0]);
      const requestID = parsedLog.args.requestId;
    console.log(requestID)
    })
  );
}