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
  PINATA_BASE_URL,
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
const pinataBaseUrl = PINATA_BASE_URL;
const USE_PORT = PORT || 3001;
server.listen(USE_PORT, function() {
  console.log(`listening on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cors());

app.get('/settings', function(req, res) {
  console.log('settings');
  let settings = fs.readFileSync('./activationData/settings.json');
  res.send(settings);
})

app.get('/logo', function(req, res) {
  console.log('logo');
  let logo = fs.readFileSync('./activationData/logo.png')
  res.send(logo)
})

app.get('/digitalprops/:param', function(req, res) {
  if (req.params.param === 'file_names') {
    fs.readdir('./activationData/digitalProps', (err, files) => {
      files = files.filter(name => {
        return name[0] !== '.';
      })
      res.json({files});
    });
  } else {
    fs.readdir('./activationData/digitalProps', (err, files) => {
      let prop = fs.readFileSync(`./activationData/digitalProps/${req.params.param}`)
      res.send(prop);
    })
  }
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.post('/session', upload.single('file'), (req, res) => {
  const { file, title, description } = req.body;
  const b64string = file.slice(file.indexOf(','));
  var success = {
    picture: null,
    text: null,
  }
  let buf = Buffer.from(b64string, 'base64');
  let rando = Math.floor(Math.random() * Math.pow(10, 9));
  const imageFilename = `./uploads/image-${rando}.jpg`;
    fs.writeFile(imageFilename, buf, async function(err) {
      if(err) {
        success.picture = false;
        return console.log(err);
      }
      const jsonFilename = `./uploads/aaa.json`;
      const imageUpload = await pinFileToIPFS(imageFilename);
      const { IpfsHash } = imageUpload.data;
      console.log('##image upload hash: ', IpfsHash);
      const metaData = getMetadata(IpfsHash);
      const metaDataFilename = `./uploads/meta-data.json`
      fs.writeFile(metaDataFilename, metaData, async function(err) {
        if(err) {
          success.text = false;
          return console.log(err);
        }
        const metaDataUpload = await pinFileToIPFS(metaDataFilename);
        const metaDataHash = metaDataUpload.data.IpfsHash;
        const metaDataUrl = `${pinataBaseUrl}${metaDataHash}`;
        console.log('##before mint NFT');
        const nftSubmit = await mintNFT(metaDataUrl);
        console.log('##after mint NFT');
        if (nftSubmit.transactionHash) {
          res.json({message: 'success!'});
        } else {
          res.json({message: 'error :('})
        }
      }); 
    });
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});