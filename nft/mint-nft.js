require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0x456e78B24E9a60a6F988EC3573A548fBF2920a41";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 1999999987,
      'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
    return transactionReceipt;
  }
  catch (err) {
    console.error(err);
  }
};

module.exports = { mintNFT };