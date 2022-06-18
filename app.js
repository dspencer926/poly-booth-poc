const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const socket = require('socket.io')(server);
const { pinFileToIPFS, getMetadata } = require('./nft/pinata');
const { mintNFT } = require('./nft/mint-nft');
const { mintCardanoNFT } = require('./nft/mint-cardano-nft');
const { PORT } = process.env;

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
  client.on('mint-nft', async (data) => {
    const { file, title, description, address, network } = data;
    console.log('##network: ', network);
    const b64string = file.split(',')[1];
    if (network === 'cardano') {
      const cardanoData = await mintCardanoNFT(b64string, title, description);
      socket.emit('response', cardanoData)
    } else {
      let buf = Buffer.from(b64string, 'base64');
      // generate random number for image and metadata filenames
      let rando = Math.floor(Math.random() * Math.pow(10, 9));
      const imageFilename = path.join(__dirname, `uploads/image-${rando}.jpg`);
      // write image to disk
      fs.writeFile(imageFilename, buf, async function(err) {
        if(err) {
          console.error(err);
          return res.status(500).send(err);
        }
        console.log('Uploading image to IPFS');
        // upload image to IPFS
        const imageUpload = await pinFileToIPFS(imageFilename);
        socket.emit('imageUploaded');
        const { IpfsHash } = imageUpload.data;
        console.log('Image uploaded! Hash: ', IpfsHash);
        const metaData = getMetadata({
          hash: IpfsHash,
          title,
          description,
        });
        const metaDataFilename = path.join(__dirname, `uploads/metadata-${rando}.json`);
        // write metadata to disk
        fs.writeFile(metaDataFilename, metaData, async function(err) {
          if (err) {
            return res.status(500).send(err);
          }
          // mint NFT
          if (network === 'cardano') {
            console.log('do ada minting');
            mintCardanoNFT('metaDataUrl', file, address, title, description);
          } else {
            console.log('Uploading metadata to IPFS');
            // upload metadata to ipfs
            const metaDataUpload = await pinFileToIPFS(metaDataFilename);
            socket.emit('metaDataUploaded');     
            const metaDataHash = metaDataUpload.data.IpfsHash;
            const metaDataUrl = `ipfs://${metaDataHash}`;
            console.log('Image uploaded! Hash: ', metaDataHash);
            console.log('Minting NFT...');
            const nftSubmit = await mintNFT(metaDataUrl, address);
            const { transactionReceipt, nonce } = nftSubmit;
            if (transactionReceipt) {
              console.log('NFT Minted! Transaction receipt: ', transactionReceipt);
              socket.emit('response', ({
                txId: transactionReceipt.transactionHash,
                nonce,
              }))
            } else {
              console.log('Error!')
              socket.emit('response', ({
                error: true,
              }))
            }
          }
        }); 
      });
    }
  });
});

app.get('/overlay', function (req, res) {
  res.sendFile(path.join(__dirname, 'assets/overlay.png'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});