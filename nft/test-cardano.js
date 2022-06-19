const axios = require('axios').default;


const HOST = 'cardano-testnet.tangocrypto.com';
const APP_ID = 'dfe657159c3346108f91bc2d489b5305';
const API_KEY = '26139354f7f54d189f84fe463d778606';
const COLLECTION_ID = 'd1cb8ba2e9864437bb10fb3c13247284';

axios.defaults.baseURL = `https://${HOST}/${APP_ID}/v1`;
axios.defaults.headers.common['x-api-key'] = API_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';


const collection = {
    "name": "Tango Collection",
    "description": "Tango collection description",
    "url": "https://www.tangocrypto.com",
    "payout_address": "addr_test1qp9mj7vnenx4v99hw7ztfq03n7dmmujpgtlyfjhhel9w67nk72usllcew208n60ym94xcptfrgytuy5apwp565x28jgsg0ztq3",
    "policy": {
        "lock": true,
        "lock_time": "2023-02-24"
    },
    "metadata": {
        "asset_name": "<asset_name>",
        "name": "<name>",
        "image": "<image_link>",
        "media_type": "<mime_type>",
        "description": "<description>",
        "attributes": {
            "color": "<color>",
            "right_eye": "<right_eye>",
            "left_eye": "<left_eye>",
            "mouth": "<mouth>",
            "collection": "Faces Collection",
            "artist": "Tangocrypto",
            "twitter": "https://twitter.com/tango_crypto",
            "copyright": "Tangocrypto 2022"
        },
        "version": "1.0"
    }
};

const tokensArr = {
  "tokens": [
    {
      "asset_name": "FACE#01",
      "name": "FACE#01",
      "description": "Faces collection",
      "media_type": "png",
      "custom_attributes": {
        "md5checksum": "b58e62a83802b2bf0792a4e983dd2ff3cf9e0c1e"
      },
      "metadata_attributes": [],
      "image": "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"
    },
  ]
};


const salePhase = {
    "type": "random",
    "total_tokens": 1,
    "reservation_time": 300,
    "price_tiers": [{
        "name": "Silver plan",
        "quantity": 1,
        "supply": 1,
        "price": 10000000
    },{
        "name": "Golden plan",
        "quantity": 1,
        "supply": 1,
        "price": 15000000
    }]
};


async function getCollection() {
  try {
      console.log("here");
      const response = await axios.get('/nft/collections');
      console.log(response.data);
  } catch (error) {
      console.error(error);
  }
}

async function createCollection(collection) {
  try {
      const response = await axios.post('/nft/collections', JSON.stringify(collection));
      console.log(response.data);
      return response.data.id;
  } catch (error) {
      console.error('create collection error');
  }
}

async function createTokens(collectionId, tokens) {
  try {
      const response = await axios.post(`/nft/collections/${collectionId}/tokens`, JSON.stringify(tokens));
      console.log(response.data);
  } catch (error) {
    console.error('create token error');
    console.error('create token error');
    console.error('create token error');
    console.error('create token error');
    console.error('create token error');
    console.error(error);
  }
}

async function createSalePhase(collectionId, salePhase) {
  try {
      console.log("Create collection");
      const response = await axios.post(`/nft/collections/${collectionId}/phases`, JSON.stringify(salePhase));
      return response.data;
  } catch (error) {
      console.error('create sale phase error');
  }
}

async function mintCardanoNFT(){
  // let collectionId = await createCollection(collection);
  let tokens = await createTokens(COLLECTION_ID, tokensArr);
  let phase = await createSalePhase(COLLECTION_ID, salePhase);
  console.log(phase);
}

module.exports = { mintCardanoNFT };


// curl --request POST \
//   --url https://cardano-mainnet.tangocrypto.com/dfe657159c3346108f91bc2d489b5305/v1/nft/collections \
//   --header 'Content-Type: application/json' \
//   --header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
//   --data '{
//   "name": "Test FlashMint Collection",
//   "description": "Test FlashMint Collection description",
//   "url": "https://flashmint.pics",
//   "payout_address": "addr1q8uyrutk4j23f0l9sgpu0zspgtxmw0402s0jy9csjdvjf43wduyuddzvkzenw0k4gx6q8x4jj59pyl4yqh7scy883rwsm3k5a7",
//   "policy": {
//     "lock": false
//   }
// }'