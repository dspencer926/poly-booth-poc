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

async function mintNFT(tokenURI, toAddress) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    console.log('##nonce: ', nonce);
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': CONTRACT_ADDRESS,
      'nonce': nonce,
      'gas': 10000000,
      'maxPriorityFeePerGas': 29999999870,
      'data': nftContract.methods.mintNFT(toAddress, tokenURI).encodeABI()
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log('##signedTx: ', signedTx);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
    return {
      transactionReceipt,
      nonce
    };
  }
  catch (err) {
    console.error(err);
  }
};

module.exports = { mintNFT };