require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {
  CARDANO_API_URL,
  TANGO_CRYPTO_APP_ID,
  TANGO_CRYPTO_API_KEY,
  CARDANO_COLLECTION_ID,
} = process.env

// const TANGO_CRYPTO_APP_ID = '877ca5dbdb574b7baaad4982d206c77e'; // test
// const CARDANO_COLLECTION_ID = '9be1b17ab7a94a9bad70f7a0f8637549'; // test
const baseUrl = `${CARDANO_API_URL}/${TANGO_CRYPTO_APP_ID}`;
const pinUrl = `${baseUrl}/v1/nft/collections/${CARDANO_COLLECTION_ID}/tokens`;
const saleUrl = `${baseUrl}/v1/nft/collections/${CARDANO_COLLECTION_ID}/sales`;
const makeGetTokenUrl = (id) => `${baseUrl}/v1/nft/collections/${CARDANO_COLLECTION_ID}/tokens/${id}`

// const blockTestUrl = 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/blocks/latest';

const getPinBody = ({ title, description, base64 }) => ({
  tokens: [
    {
      "asset_name": title,
      "name": title,
      "description": description,
      "media_type": "image/jpg",
      "image": base64,
      "price": 10000000,
      "metadata_attributes": [],
    }
  ]
});

const getSaleBody = (id) => ({
  "type": "fixed",
  "price": 10000000,
  "reservation_time": 30000,
  "tokens": [id],
})

const submitPin = async (pinBody) => {
  const pinResponse = await fetch(pinUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TANGO_CRYPTO_API_KEY,
    },
    body: JSON.stringify(pinBody),
  });
  const pinJson = await pinResponse.json();
  return pinJson;
}
const submitSale = async (saleBody) => {
  const response = await fetch(saleUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TANGO_CRYPTO_API_KEY,
    },
    body: JSON.stringify(saleBody),
  })
  const json = await response.json();
  return json;
}
  
  const pollTokenEndpoint = async (id) => {
    const result = await fetch(makeGetTokenUrl(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TANGO_CRYPTO_API_KEY,
      },
    });
    const json = await result.json();
    return json;
  };


  const poll = async function (fn, fnCondition, ms) {
    let result = await fn();
    while (fnCondition(result)) {
      console.log('POLLING!!: ', result);
      await wait(ms);
      result = await fn();
    }
    return result;
  };
  
  const wait = function (ms = 1000) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

async function mintCardanoNFT(base64, title, description) {
  try {
    console.log('Minting Cardano NFT ...');
    const pinBody = getPinBody({ base64, title, description })
    console.log('##pinBody: ', pinBody);
    const pinResponse = await submitPin(pinBody);
    console.log('##pinResponse: ', pinResponse);
    if (pinResponse.data.length) {
      const { id, status } = pinResponse.data[0];
      console.log('##NFT id: ', id);
      tokenStatus = status;
      const saleBody = getSaleBody(id);
      let fetchReport = async () => await pollTokenEndpoint(id);
      let validate = result => result.status !== 'FOR_SALE';
      let response = await poll(fetchReport, validate, 1000);
      console.log('##response: ', response);
      // console.log('##saleBody: ', saleBody);
      // console.log('##saleUrl: ', saleUrl);
      // const mintResponse = await submitSale(saleBody);
      // console.log('##mintJson: ', mintResponse);
      if (response && response.payment_link) {
        console.log('##paymentLink: ', response.payment_link)
        return { paymentLink: response.payment_link };
      }
      throw new Error('no payment link!')
    } else {
      throw new Error('no data from pin request!!');
    }
  }
  catch (err) {
    console.error(err);
    return { error: err };
  }
};

module.exports = { mintCardanoNFT };
