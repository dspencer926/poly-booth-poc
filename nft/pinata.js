require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { PINATA_JWT } = process.env;

const getMetadata = (hash) => JSON.stringify({
  "attributes" : [ {
    "trait_type" : "Name",
    "value" : "Test-image"
  }, {
    "trait_type" : "Ballin status",
    "value" : 100
  } ],
  "description" : "NFT Booth Image",
  "image" : `ipfs://${hash}`,
  "name" : "Memories"
})

const pinFileToIPFS = (filename) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(filename));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: filename.split('/').pop(),
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });

    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        });
};

module.exports = { pinFileToIPFS, getMetadata };