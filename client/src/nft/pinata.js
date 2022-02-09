const axios = require('axios');
const FormData = require('form-data');
const { PINATA_JWT, PINATA_BASE_URL } = process.env;

const getMetadata = ({ title, description, hash }) => JSON.stringify({
  "title": title,
  "description" : description,
  "image" : `ipfs://${hash}`,
});

const pinFileToIPFS = (file) => {
  let data = new FormData();
  data.append('file', file);

  return axios
    .post(PINATA_BASE_URL, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    });
};

module.exports = { pinFileToIPFS, getMetadata };