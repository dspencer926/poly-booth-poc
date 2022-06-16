
curl --location --request POST 'https://cardano-testnet.tangocrypto.com/877ca5dbdb574b7baaad4982d206c77e/v1/nft/collections/9be1b17ab7a94a9bad70f7a0f8637549/sales' \
--header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": "fixed",
    "price": 8000000,
    "reservation_time": 300,
    "tokens": ["fef20e55c675452cb08edfc076d5a6c5" ]
}'



curl --location --request POST 'https://cardano-mainnet.tangocrypto.com/d84809bd0eaf4a7897b573fd163734c7/v1/nft/collections' \
--header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "FlashMint Collection #2",
    "payout_address": "addr1qyashhdquytn2ytcc6hugrzznkur6nfkmcl2cz0km34sh4hay63gddq543x58gsr32zj4s079j2n25qfgqgcshd2399s3v3nf8",
    "policy": {
        "lock": false
    }
}'

curl --location --request GET 'https://cardano-testnet.tangocrypto.com/4bf64afb48b041d4a7b2e1bfca27e560/v1/nft/collections/161a90be6d7f4000a7c82767ae4a3bf1/tokens' \
--header 'x-api-key: 26139354f7f54d189f84fe463d778606'

curl --location --request GET 'https://cardano-testnet.tangocrypto.com/<app-id>/v1/nft/collections/61844bfbb75c4782085f01fd/tokens \
--header 'x-api-key: <your-api-key>'

{"data":[],"cursor":""}


curl --request POST \
  --url https://cardano-mainnet.tangocrypto.com/4bf64afb48b041d4a7b2e1bfca27e560/v1/nft/collections/161a90be6d7f4000a7c82767ae4a3bf1/tokens \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
  --data '{
  "tokens": [
    {
      "asset_name": "FlashMint2",
      "name": "test5",
      "description": "test5",
      "media_type": "image/jpg",
      "image": "whatever",
      "metadata_attributes": []
    }
  ]
}'


curl --request POST \
  --url 'https://cardano-mainnet.tangocrypto.com/4bf64afb48b041d4a7b2e1bfca27e560/v1/nft/collections/161a90be6d7f4000a7c82767ae4a3bf1/sales' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: 26139354f7f54d189f84fe463d778606' \
  --data '{
    "type": "fixed",
    "price": 1000000,
    "reservation_time": 300,
    "tokens": [ "cd9ab0fa8bb94fbb907255a042c908d7" ]
  }'
