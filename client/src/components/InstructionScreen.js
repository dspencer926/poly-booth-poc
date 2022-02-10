import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Box, Typography, Card, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { status } from '../utils/constants';
import PolygonScanScreenshot from '../assets/polygonscan-screenshot.jpeg';
import MetamaskScreenshot from '../assets/metamask-screenshot.jpeg';
import MetamaskScreenshot2 from '../assets/metamask-screenshot-2.png';
import BottomButtonRow from './BottomButtonRow';

const POLYGON_SCAN_BASE_URL='https://polygonscan.com/tx/';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  topRow: {
    alignItems: 'center',
    display: 'flex',
    padding: '0 12px',
    position: 'relative',
  },
  startOverButton: {
    height: 60,
    position: 'absolute !important',
    right: 12,
    width: 96,
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    margin: 12,
    padding: 32,
  },
  cardHalf: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  screenshot: {
    border: '1px solid black',
    height: 600,
    margin: 'auto',
  }
});

const InstructionScreen = ({
  txId,
  navigateToVideoScreen,
}) => {
  const classes = useStyles();
  const canvasRef = useRef();

  useEffect(() => {
    const url = `${POLYGON_SCAN_BASE_URL}${txId}`;
    const encoded = encodeURIComponent(url);
    QRCode.toCanvas(canvasRef.current, url, function (error) {
      if (error) console.error(error)
    });
  });

  return (
    <Box className={classes.container}>
      <Box className={classes.topRow}>
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: 72,
            marginLeft: '36px',
          }}
        >
          How to Import Your NFT
        </Typography>
        <Button
          className={classes.startOverButton}
          color="primary"
          variant="contained"
          onClick={navigateToVideoScreen}
          size="large"
          endIcon={<NavigateNextIcon />}
        >
          Start Over
        </Button>
      </Box>
      <Card className={classes.card}>
        <div className={classes.cardHalf}>
          <Typography className={classes.cardText}>
            First, scan this QR code with your phone and navigate to the website that it
            links to (polygonscan.com).
          </Typography>
        </div>
        <div className={classes.cardHalf}>
          <canvas
            className={classes.canvas}
            ref={canvasRef}
            height={300}
            width={300}
          />
        </div>
      </Card>
      <Card className={classes.card}>
        <div className={classes.cardHalf}>
          <Typography className={classes.cardText}>
            On the Polygonscan page, scroll down until you see the
            <strong> "Interacted With (To)" </strong> 
            header, and click the small "copy" icon (circled in black) to copy that address
            to your clipboard.  Also take note of the 
            <strong> "TokenID" </strong> number (circled in blue).
            You will need this number to import your NFT.
          </Typography>
        </div>
        <div className={classes.cardHalf}>
          <img className={classes.screenshot} src={PolygonScanScreenshot} />
        </div>
      </Card>
      <Card className={classes.card}>
        <div className={classes.cardHalf}>
          <Typography className={classes.cardText}>
            Open your Metamask wallet and click the
            <strong> "NFTs" </strong>  tab and then the 
            <strong> "Import NFTs" </strong> link.
          </Typography>
        </div>
        <div className={classes.cardHalf}>
          <img className={classes.screenshot} src={MetamaskScreenshot} />
        </div>
      </Card>
      <Card className={classes.card}>
        <div className={classes.cardHalf}>
          <Typography className={classes.cardText}>
            Paste the contract's address (which you copied from Polygonscan) into the 
            <strong> "Address" </strong>field and type the
            <strong> "TokenID" </strong> number (also from Polygonscan) in 
            the <strong> "ID" </strong> field and click the
            <strong> "IMPORT" </strong> button. You should 
            see the NFT in your wallet!
          </Typography>
        </div>
        <div className={classes.cardHalf}>
          <img className={classes.screenshot} src={MetamaskScreenshot2} />
        </div>
      </Card>
    </Box>
  );
};

export default InstructionScreen;