import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { deriveSponsorWalletAddress, deriveAirnodeXpub } from '@api3/airnode-admin';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { getDeployedContracts } from "zksync-web3/build/src/utils";
const HDWallet = require('ethereum-hdwallet')

// An example that will call the Requester Contract and will make a full request
const provider = new Provider("https://zksync2-testnet.zksync.dev");

// DERIVING THE PATH OF THE SPONSOR WALLET
// ADD IN THE ADDRESS OF THE REQUESTER CONTRACT
const requesterAddressTest = "0x03A80cE62615F2d0C942EC283508C27729585988";
const deriveWalletPathFromSponsorAddress = (sponsorAddress: string, protocolId) => {
    const sponsorAddressBN = ethers.BigNumber.from(ethers.utils.getAddress(sponsorAddress));
    const paths : string[] = [];
    for (let i = 0; i < 6; i++) {
      const shiftedSponsorAddressBN = sponsorAddressBN.shr(31 * i);
      paths.push(shiftedSponsorAddressBN.mask(31).toString());
    }
    return `${protocolId}/${paths.join('/')}`;
  };

// Getting the private key of the sponsor Wallet from the Airnode Mnemonic
const hdwallet = HDWallet.fromMnemonic("<PKEY>")
console.log(`0x${hdwallet.derive(`m/44'/60'/0'/${deriveWalletPathFromSponsorAddress(requesterAddressTest, 1)}`).getAddress().toString('hex')}`)
const PKEYsponsorWallet = (hdwallet.derive(`m/44'/60'/0'/${deriveWalletPathFromSponsorAddress(requesterAddressTest, 1)}`).getPrivateKey().toString('hex'))

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
console.log(`Running deploy script for the Requester contract`);

// Initialize the wallets.

    const sponsorWallet = new Wallet(PKEYsponsorWallet)
    const signer = provider.getSigner(sponsorWallet.address)
    const wallet = new Wallet("");
    const signer2 = provider.getSigner(wallet.address)
// Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, sponsorWallet);
    const requesterArtifact = await deployer.loadArtifact("Requester");

// Fulfill Function ID
    const iface = new ethers.utils.Interface(requesterArtifact.abi);
    console.log("Interface works");
    const fuID = iface.getSighash("fulfill");
    console.log(fuID);

    const rrp = await deployer.loadArtifact("AirnodeRrpV0")
    const rrpIface = new ethers.utils.Interface(rrp.abi)

    const rrpAddress = "0xbD5263fa8c93Deb3417d49E63b444cBd541922FD";
    const _rrpContract = hre.artifacts.readArtifactSync("AirnodeRrpV0")
    const rrpContract = new ethers.Contract(rrpAddress, _rrpContract.abi, signer2);
//   const requesterContract = await deployer.deploy(requesterArtifact, [rrpAddress]);
//   const requesterAddress = requesterContract.address;
//   console.log(`${requesterArtifact.contractName} was deployed to ${requesterAddress}`);

    const airnode = "0x6A7F359d025aE2ebdC36E594F633b39a02Bfe88C"
    const sponsor = requesterAddressTest;
    const endpointId = "0xfd19ee2c054da313208b4a6106c336286fc6a9f72dd5d0bc8619c018c384c74a";
    const airnodeXpub = "xpub6DUz9nJVxJpVieSaBesGdwRgdznuPe875cczeg6HE1RoN7Hzm9Dsty8i8T5h4ZQzm4ShkwCkT2VXwnJETQH4XjGHY6bbKdqypLin7wrxoHY";
    const sponsorWalletAddress = deriveSponsorWalletAddress(airnodeXpub, airnode, sponsor);
    const encodedParams = "0x315353535353000000000000000000000000000000000000000000000000000071756572790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160737562677261706800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002006170695f6b65790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002605f7061746800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a05f7479706500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000627b6d61726b6574706c616365732866697273743a203529207b6964206e616d6520736c7567206e6574776f726b7d20636f6c6c656374696f6e732866697273743a203529207b6964206e616d652073796d626f6c20746f74616c537570706c797d7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c41776f78455a6269574c7676366533516476644d5a773457445552644762765066486d5a5263384470667a39000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000203837626165376336663163323665373932303966383635326337343566666162000000000000000000000000000000000000000000000000000000000000001e646174612e636f6c6c656374696f6e732e322e746f74616c537570706c7900000000000000000000000000000000000000000000000000000000000000000006696e743235360000000000000000000000000000000000000000000000000000";
    console.log(`Sponsor Wallet Address: ${sponsorWalletAddress}`);


    const sample_data = 123;
    // ADD IN YOUR REQUEST ID
    const requestId = '0x4943cee6e7f0160b0fee795bfdb190e7437f73c7bb227bbfc655a58b187aa163';
    const data = ethers.utils.defaultAbiCoder.encode(['int256'], [sample_data]);
    console.log(`Sample Data Encoded: ${data}`);
    async function getSignature(){
        const signature = await sponsorWallet.signMessage(
            ethers.utils.arrayify(
            ethers.utils.keccak256(
                ethers.utils.solidityPack(['bytes32', 'uint256'], [requestId, data])
            )
            ),
        );
      return signature;
        }
    const signature = await getSignature();
    console.log(`Signature: ${signature}`)

    // NEED TO FIGURE OUT THE FUNCTION ID
    const fulfillFunctionId = fuID;

    const fulfill = await rrpContract.fulfill(
        requestId,
        airnode,
        requesterAddressTest,
        fulfillFunctionId,
        data,
        signature
        // encode the value in bytes32
        ,
    );
    await sponsorWallet.sendTransaction(fulfill);

    // console.log(provider.getTransactionReceipt(fulfill.hash))

}