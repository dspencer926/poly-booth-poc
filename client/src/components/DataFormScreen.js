import React, { useState, useRef } from 'react';
import QrScanner from 'qr-scanner';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { makeStyles } from '@mui/styles';
import {
  Box,
  TextField,
  Typography,
  Modal,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import BottomButtonRow from './BottomButtonRow';
import { status, dimensions } from '../utils/constants';
import LoadingModal from './LoadingModal'

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: '64px 0',
    textAlign: 'center',
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
    margin: 'auto',
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
});

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Please enter a title'),
  description: yup
    .string()
    .required('Please enter a description'),
  address: yup
    .string()
    .required('Please enter an address'), // TODO: verify that this is a valid ETH address
});

const DataFormScreen = ({
  navigateToVideoScreen,
  navigateToInstructionScreen,
  canvasImage,
  setTxId,
  socket,
}) => {
  const classes = useStyles();
  const videoRef = useRef(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const closeQrModal = () => setIsQrModalOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      file: canvasImage,
      address: '',
    },
    validationSchema,
    onSubmit: async (data) => {
      setIsLoading(true); 
      socket.emit('mint-nft', ({ ...data, network: 'cardano' }));
      socket.on('response', data => {
        setIsLoading(false);
        setTxId(data.txId);
        navigateToInstructionScreen();
      });
    }
  });

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
          />
          <TextField
            id="address"
            placeholder="Polygon Address"
            name="address"
            variant="outlined"
            sx={{ margin: '12px 0' }}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.address}
            error={formik.touched.address && !!formik.errors.address}
            helperText={formik.touched.address && formik.errors.address}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={getQrCode}>
                    <QrCode2Icon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
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
    </Box>
  );
};

export default DataFormScreen;
