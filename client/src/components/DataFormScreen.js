import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";

import { makeStyles } from '@mui/styles';
import {
  Box,
  TextField,
  Modal,
  InputAdornment,
  IconButton,
  Fade,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import BottomButtonRow from './BottomButtonRow';
import { status, dimensions } from '../utils/constants';
import LoadingModal from './LoadingModal'
// import Keyboard from './Keyboard';

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: '64px 0',
    width: dimensions.SCREEN_WIDTH,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 32,
  },
  textField: {
    margin: '12px 0',
  },
  img: {
    margin: '0 auto 24px',
  },
  modalCentered: {
    alignItems: 'flex',
    display: 'flex',
    justifyContent: 'flex',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 'auto',
    padding: 96,
    position: 'relative',
    width: 'fit-content',
  },
  modalContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 120,
    justifyContent: 'space-around',
  },
  closeModalButton: {
    right: 12,
    position: 'absolute !important',
    top: 12,
  },
  cardanoIframe: {
    minWidth: 500,
    minHeight: 780,
  },
});

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Please enter a title'),
  description: yup
    .string()
    .required('Please enter a description'),
  network: yup
    .string()
    .required('Please select a network'),
  address: yup
    .string()
});

const DataFormScreen = ({
  navigateToVideoScreen,
  navigateToInstructionScreen,
  canvasImage,
  setTxId,
  socket,
  config,
}) => {
  const classes = useStyles();
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const closeQrModal = () => setIsQrModalOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [keyboardLayout, setKeyboardLayout] = useState('default');
  const { isKeyboardEnabled, availableNetworks } = config;
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      file: canvasImage,
      address: '',
      network: availableNetworks[0],
    },
    validationSchema,
    onSubmit: async (data) => {
      setIsLoading(true); 
      socket.emit('mint-nft', (data));
      socket.on('response', data => {
        console.log('##data: ', data);
        setIsLoading(false);
        if (data.txId) {
          setTxId(data.txId);
          navigateToInstructionScreen();
        } else if (data.paymentLink) {
          console.log('##data.paymentLink: ', data.paymentLink);
          setPaymentLink(data.paymentLink);
        }
      });
    }
  });

  const closePurchaseModal = () => {
    setPaymentLink(null);
  }

  const handleFocus = (e) => {
    setFocusedInput(e.target.id);
  }

  const handleBlur = () => {};

  const handleShift = () => {
    const newLayout = keyboardLayout === "default" ? "shift" : "default";
    setKeyboardLayout(newLayout);
  };

  const onKeyPress = (button) => {
    if (button === '{tab}' || button === '{enter}') {
      return;
    } else if (button === '{shift}' || button === '{lock}') {
      handleShift();
    } else if (focusedInput) {
      let newValue = formik.values[focusedInput];
      if (button === '{bksp}') {
        newValue = newValue.slice(0, -1);
      } else if (button === '{space}') {
        newValue = formik.values[focusedInput].concat(' ');
      } else {
        newValue = formik.values[focusedInput].concat(button);
      }
      formik.setFieldValue(focusedInput, newValue);
    }
  }

  const getQrCode = () => {
    setIsQrModalOpen(true);
    let constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          qrScanner.stop();
          videoRef.current.pause();
          const ethAddress = result.split(':').pop().split('@')[0];
          formik.setFieldValue('address', ethAddress);
          formik.setTouched({ 'address': true });
          setIsQrModalOpen(false);
        }
      );
      qrScanner.start();
    });
  }

  useEffect(() => {
    iframeRef.current.src = `${paymentLink}&random=${Math.floor(Math.random() * 1000)}`;
  }, [paymentLink]);
  
  return (
    <Box className={classes.container}>
      <img
        className={classes.img}
        src={canvasImage}
        height={dimensions.SCREEN_HEIGHT}
        width={dimensions.SCREEN_WIDTH}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box className={classes.form}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Network</InputLabel>
            <Select
              id="network"
              placeholder="Network"
              name="network"
              variant="outlined"
              value={formik.values.network}
              label="Network"
              onChange={formik.handleChange}
              disabled={config.availableNetworks.length <= 1}
            >
              {config.availableNetworks.map((val) => (
                <MenuItem value={val} key={val}>
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="title"
            label="Title"
            name="title"
            variant="outlined"
            sx={{ margin: '12px 0' }}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.title}
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.touched.title && formik.errors.title}
            onFocus={handleFocus}
            onBlur={handleBlur}
            focused={focusedInput === 'title'}
          />
          <TextField
            id="description"
            label="Description"
            name="description"
            variant="outlined"
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.description}
            error={formik.touched.description && !!formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
            onFocus={handleFocus}
            onBlur={handleBlur}
            focused={focusedInput === 'description'}
          />
          {formik.values.network !== 'cardano' && (<TextField
            id="address"
            placeholder="Wallet Address"
            name="address"
            variant="outlined"
            sx={{ margin: '12px 0' }}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.address}
            error={formik.touched.address && !!formik.errors.address}
            helperText={formik.touched.address && formik.errors.address}
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={getQrCode}>
                    <QrCode2Icon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />)}
        </Box>
      </form>
      <BottomButtonRow
        onClickLeftButton={navigateToVideoScreen}
        onClickRightButton={formik.handleSubmit}
        screenStatus={status.DATA_FORM_SCREEN}
      />
      <Modal
        className={classes.modalCentered}
        open={isQrModalOpen}
        onClose={closeQrModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={isQrModalOpen}>
          <Box className={classes.modalContainer}>
            <IconButton
              className={classes.closeModalButton}
              onClick={closeQrModal}
            >
              <CloseIcon />
            </IconButton>
            <video
              ref={videoRef}
              width={600}
            />
          </Box>
        </Fade>
      </Modal>
      <LoadingModal
        isOpen={isLoading}
        socket={socket}
      />
      <Modal
        className={classes.modalCentered}
        open={!!paymentLink}
        onClose={closePurchaseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={paymentLink}>
          <Box className={classes.modalContainer}>
            <IconButton
              className={classes.closeModalButton}
              onClick={closePurchaseModal}
            >
              <CloseIcon />
            </IconButton>
            <iframe
              ref={iframeRef}
              src={paymentLink}
              title="Purchase Cardano NFT"
              className={classes.cardanoIframe}
              allow={`clipboard-write self ${paymentLink}`}
            />
          </Box>
        </Fade>
      </Modal>
      <Keyboard
        onKeyPress={onKeyPress}
        layoutName={keyboardLayout}
        // theme={classes.keyboard}
      />
    </Box>
  );
};

export default DataFormScreen;
