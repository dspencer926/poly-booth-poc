const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const socket = require('socket.io')(server);
const { pinFileToIPFS, getMetadata } = require('./nft/pinata');
const { mintNFT } = require('./nft/mint-nft');
const {
  PORT,
} = process.env;

const fs = require('fs');
const USE_PORT = PORT || 3001;
server.listen(USE_PORT, function() {
  console.log(`listening on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cors());

socket.on('connection', client => {
  client.on('mint-nft', data => {
    const { file, title, description, address } = data;
    const b64string = file.slice(file.indexOf(','));
    let buf = Buffer.from(b64string, 'base64');
    let rando = Math.floor(Math.random() * Math.pow(10, 9));
    const imageFilename = path.join(__dirname, `uploads/image-${rando}.jpg`);
    fs.writeFile(imageFilename, buf, async function(err) {
      if(err) {
        console.error(err);
        return res.status(500).send(err);
      }
      const imageUpload = await pinFileToIPFS(imageFilename);
      socket.emit('imageUploaded');
      const { IpfsHash } = imageUpload.data;
      console.log('##image upload hash: ', IpfsHash);
      const metaData = getMetadata({
        hash: IpfsHash,
        title,
        description,
      });
      const metaDataFilename = path.join(__dirname, `uploads/metadata-${rando}.json`);
      fs.writeFile(metaDataFilename, metaData, async function(err) {
        if (err) {
          return res.status(500).send(err);
        }
        const metaDataUpload = await pinFileToIPFS(metaDataFilename);
        socket.emit('metaDataUploaded');     
        const metaDataHash = metaDataUpload.data.IpfsHash;
        const metaDataUrl = `ipfs://${metaDataHash}`;
        console.log('##before mint NFT');
        const nftSubmit = await mintNFT(metaDataUrl, address);
        console.log('##after mint NFT');
        if (nftSubmit.transactionReceipt) {
          socket.emit('response', ({
            txId: nftSubmit.transactionReceipt.transactionHash,
            nonce: nftSubmit.nonce,
          }))
        } else {
          socket.emit('response', ({
            error: true,
          }))
        }
      }); 
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});