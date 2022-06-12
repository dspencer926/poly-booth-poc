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

// const appId = 'd84809bd0eaf4a7897b573fd163734c7';
const appId = '4bf64afb48b041d4a7b2e1bfca27e560';
const collectionId = '161a90be6d7f4000a7c82767ae4a3bf1';
const baseUrl = 'https://cardano-mainnet.tangocrypto.com/'
const pinUrl = `${baseUrl}/${appId}/v1/nft/collections/${collectionId}/tokens`;
const saleUrl = `${baseUrl}/${appId}/v1/nft/collections//${collectionId}/sales`;
const apiKey = '26139354f7f54d189f84fe463d778606';
// const blockTestUrl = 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/blocks/latest';

async function mintCardanoNFT(tokenURI, base64, toAddress, title, description) {
  try {
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
    // console.log('##pinBody: ', pinBody);
    const pinResponse = await fetch(pinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(pinBody),
    })
    const pinJson = await pinResponse.json();
    console.log('##pinJson: ', pinJson);
    if (pinJson.data.length) {
      const { id } = pinJson.data[0];
      console.log('##NFT id: ', id);
      const saleBody = {
        "type": "fixed",
        "price": 0,
        "reservation_time": 300,
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
    } else {
      console.log('##no data from pin request!!');
    }



    // Test get block
    // fetch('https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/blocks/latest', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': '26139354f7f54d189f84fe463d778606',
    //   }
    // })
    // .then(res => {
    //   console.log('##res: ', res);
    //   return res.json();
    // })
    // .then(json => console.log('##json: ', json));

  }
  catch (err) {
    console.error(err);
  }
};

module.exports = { mintCardanoNFT };

// {
//   data: [
//     {
//       id: '0d1db4dd8e4f4a309408cc407bf2514f',
//       asset_name: 'FlashMint',
//       name: 'lsdkfjl',
//       fingerprint: 'asset1dfkc40pqzpxttmg6eql9q87w5266lv6tgygzn4',
//       status: 'FOR_SALE',
//       description: 'asdldkfjljasdflkjl',
//       image: 'ipfs://QmW6aRxZg64sXLdEWYc7tBouhGAx3XpPdtKg66jgTKBHXP',
//       media_type: 'image/jpg',
//       policy: [Object],
//       metadata: [Object],
//       created_at: '2022-06-12T16:23:33.237Z',
//       updated_at: '2022-06-12T16:23:37.738Z'
//     },
//     {
//       id: '13f19bdd3ad343938753f7ec7cf4c4a6',
//       asset_name: 'FlashMint',
//       name: 'kjhkhj',
//       fingerprint: 'asset1dfkc40pqzpxttmg6eql9q87w5266lv6tgygzn4',
//       status: 'FOR_SALE',
//       description: 'kjhkjhkjh',
//       image: 'ipfs://QmYxPCyitVmAfiJiUjwAeGX4C5kKmKqisFXPDx6TghSug2',
//       media_type: 'image/jpg',
//       policy: [Object],
//       metadata: [Object],
//       created_at: '2022-06-11T16:17:45.446Z',
//       updated_at: '2022-06-11T16:17:50.225Z'
//     },
//     {
//       id: '658b8a2f87854bf5841c4db12bab6e7f',
//       asset_name: 'FlashMint',
//       name: 'khgkjgh',
//       fingerprint: 'asset1dfkc40pqzpxttmg6eql9q87w5266lv6tgygzn4',
//       status: 'FOR_SALE',
//       description: 'jhghjg',
//       image: 'ipfs://QmPfqkaUBMzV5wfJavPBTngjhuqbJC9jdAcocUSPWgfPK3',
//       media_type: 'image/jpg',
//       policy: [Object],
//       metadata: [Object],
//       created_at: '2022-06-12T16:45:54.599Z',
//       updated_at: '2022-06-12T16:46:00.243Z'
//     }
//   ],
//   cursor: ''
// }

// {
//   type: 'fixed',
//   price: 0,
//   reservation_time: 300,
//   tokens: [ '0d1db4dd8e4f4a309408cc407bf2514f' ]
// }




// curl --location --request POST 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/nft/collections/82ecc7136d8745c2a467f3fc95926368/sales' \
// --header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "type": "fixed",
//     "price": 0,
//     "reservation_time": 300,
//     "tokens": ["13f19bdd3ad343938753f7ec7cf4c4a6" ]
// }'



// curl --location --request POST 'https://cardano-mainnet.tangocrypto.com/4bf64afb48b041d4a7b2e1bfca27e560/v1/nft/collections' \
// --header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "name": "FlashMint Collection #2",
//     "payout_address": "addr1q8uyrutk4j23f0l9sgpu0zspgtxmw0402s0jy9csjdvjf43wduyuddzvkzenw0k4gx6q8x4jj59pyl4yqh7scy883rwsm3k5a7",
//     "policy": {
//         "lock": false
//     }
// }'

// curl --location --request GET 'https://cardano-mainnet.tangocrypto.com/4bf64afb48b041d4a7b2e1bfca27e560/v1/nft/collections/161a90be6d7f4000a7c82767ae4a3bf1/tokens' \
// --header 'x-api-key: 26139354f7f54d189f84fe463d778606'

// curl --location --request GET 'https://cardano-testnet.tangocrypto.com/<app-id>/v1/nft/collections/61844bfbb75c4782085f01fd/tokens \
// --header 'x-api-key: <your-api-key>'

// {"data":[],"cursor":""}