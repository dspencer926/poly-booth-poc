require('dotenv').config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
const {
  API_URL,
  PUBLIC_KEY,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
} = process.env

const web3 = createAlchemyWeb3(API_URL);
const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

async function mintNFT(tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': CONTRACT_ADDRESS,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 2999999987,
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