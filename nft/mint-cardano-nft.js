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

// const blockTestUrl = 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/blocks/latest';

async function mintCardanoNFT(base64, title, description) {
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
        'x-api-key': TANGO_CRYPTO_API_KEY,
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
          'x-api-key': TANGO_CRYPTO_API_KEY,
        },
        body: JSON.stringify(saleBody),
      });
      const mintJson = await mintResponse.json();
      console.log('##mintJson: ', mintJson);
      if (mintJson && mintJson.payment_link) {
        console.log('##paymentLink: ', mintJson.payment_link)
        return { paymentLink: mintJson.payment_link };
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
