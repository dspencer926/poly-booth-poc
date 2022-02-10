const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const server = require('http').createServer(app);
const multer = require('multer');
const cors = require('cors');
const { pinFileToIPFS, getMetadata } = require('./nft/pinata');
const { mintNFT } = require('./nft/mint-nft');
const {
  PORT,
} = process.env;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'newPic.jpg')
  }
})
const upload = multer({ 
  dest: storage,
  limits: { fieldSize: 25 * 1024 * 1024 }
})
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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.post('/session', upload.single('file'), (req, res) => {
  const { file, title, description, address } = req.body;
  const b64string = file.slice(file.indexOf(','));
  let buf = Buffer.from(b64string, 'base64');
  let rando = Math.floor(Math.random() * Math.pow(10, 9));
  const imageFilename = `image-${rando}.jpg`;
    fs.writeFile(imageFilename, buf, async function(err) {
      if(err) {
        console.error(err);
        return res.status(500).send(err);
      }
      const imageUpload = await pinFileToIPFS(imageFilename);
      const { IpfsHash } = imageUpload.data;
      const metaData = getMetadata({
        hash: IpfsHash,
        title,
        description,
      });
      const metaDataFilename = `metadata-${rando}.json`;
      console.log('##before write metadata');
      fs.writeFile(metaDataFilename, metaData, async function(err) {
        if (err) {
          return res.status(500).send(err);
        }
        console.log('##before pin metadata');
        const metaDataUpload = await pinFileToIPFS(metaDataFilename);
        const metaDataHash = metaDataUpload.data.IpfsHash;
        const metaDataUrl = `ipfs://${metaDataHash}`;
        console.log('##before mint NFT');
        const nftSubmit = await mintNFT(metaDataUrl, address);
        console.log('##after mint NFT');
        if (nftSubmit.transactionReceipt) {
          res.status(200).json({
            txId: nftSubmit.transactionReceipt.transactionHash,
            nonce: nftSubmit.nonce,
          });
        } else {
          res.status(500).json({ success: false })
        }
      }); 
    });
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});