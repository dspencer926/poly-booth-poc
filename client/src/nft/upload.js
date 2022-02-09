const { pinFileToIPFS, getMetadata } = require('./pinata');

export const upload = async (image, metadata) => {
  // const b64string = file.slice(file.indexOf(','));
  // let buf = Buffer.from(b64string, 'base64');
  let rando = Math.floor(Math.random() * Math.pow(10, 9));
  const imageFilename = `image-${rando}.jpg`;
  const imageFile = new File(image, imageFilename, { type: 'image/jpg' });
  const imageUpload = await pinFileToIPFS(imageFile);
  const { IpfsHash } = imageUpload.data;
  const jsonFilename = `metadata-${rando}.json`;
  console.log('##image upload hash: ', IpfsHash);
  // const metaData = getMetadata(IpfsHash);
  // const jsonFile = new File(metaData, jsonFilename, { type: 'application/json' });
  // console.log('##jsonFile: ', jsonFile);
  // const metaDataUpload = await pinFileToIPFS(metaDataFilename);
  // const metaDataHash = metaDataUpload.data.IpfsHash;
  // const metaDataUrl = `${pinataBaseUrl}${metaDataHash}`;
  // console.log('##before mint NFT');
  // const nftSubmit = await mintNFT(metaDataUrl);
  // console.log('##after mint NFT');
  // if (nftSubmit.transactionHash) {
  //   res.json({message: 'success!'});
  // } else {
  //   res.json({message: 'error :('})
  // }
};
