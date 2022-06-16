require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
const {
  CARDANO_API_URL,
  PUBLIC_KEY,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
} = process.env

const appId = 'd84809bd0eaf4a7897b573fd163734c7';
// const appId = '877ca5dbdb574b7baaad4982d206c77e';
const collectionId = '77851e969ee143eebe088d97257fba22';
// const collectionId = '9be1b17ab7a94a9bad70f7a0f8637549'; // test
const baseUrl = `https://cardano-mainnet.tangocrypto.com/${appId}`;
const pinUrl = `${baseUrl}/v1/nft/collections/${collectionId}/tokens`;
const saleUrl = `${baseUrl}/v1/nft/collections/${collectionId}/sales`;
const apiKey = '26139354f7f54d189f84fe463d778606';
// const blockTestUrl = 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/blocks/latest';

async function mintCardanoNFT(tokenURI, base64, toAddress, title, description) {
  try {
    console.log('Minting Cardano NFT ...');
    const pinBody = {
      tokens: [
        {
          "asset_name": "FlashMint2",
          "name": title,
          "description": description,
          "media_type": "image/jpg",
          "image": base64,
          "metadata_attributes": [],
        }
      ]
    };
    console.log('##pinBody: ', pinBody);
    const pinResponse = await fetch(pinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(pinBody),
    });
    console.log('##pinResponse: ', pinResponse);
    const pinJson = await pinResponse.json();
    console.log('##pinJson: ', pinJson);
    if (pinJson.data.length) {
      const { id } = pinJson.data[0];
      console.log('##NFT id: ', id);
      const saleBody = {
        "type": "fixed",
        "price": 10000000,
        "reservation_time": 30000,
        "tokens": [id],
      };
      console.log('##saleBody: ', saleBody);
      console.log('##saleUrl: ', saleUrl)
      const mintResponse = await fetch(saleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(saleBody),
      });
      const mintJson = await mintResponse.json();
      console.log('##mintJson: ', mintJson);
      if (mintJson && mintJson.payment_link) {
        console.log('##paymentLink: ', mintJson.payment_link)
        return mintJson.payment_link;
      }
      throw new Error('no payment link!')
    } else {
      throw new Error('no data from pin request!!');
    }
  }
  catch (err) {
    console.error(err);
  }
};

module.exports = { mintCardanoNFT };
