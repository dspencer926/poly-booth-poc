import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/Pending';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
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
    alignItems: 'flex-start',
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
  row: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  icon: {
    height: 24,
    marginRight: 24,
    width: 24,
  },
});

const LoadingModal = ({
  isOpen,
  socket,
  closeModal,
}) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [metaDataStatus, setMetaDataStatus] = useState('pending');
  const [NFTStatus, setNFTStatus] = useState('pending');
  const classes = useStyles();

  socket.on('imageUploaded', () => {
    setImageStatus('complete');
    setMetaDataStatus('loading');
  });

  socket.on('metaDataUploaded', () => {
    setMetaDataStatus('complete');
    setNFTStatus('loading');
  });

  const getIcon = status => {
    if (status === 'loading') {
      return (
        <CircularProgress
          className={classes.icon}
          size={24}
          color='secondary'
        />
      );
    }
    if (status === 'complete') {
      return <DoneIcon className={classes.icon} />
    }
    return <PendingIcon className={classes.icon} />
  }

  return (
    <Modal
      className={classes.modalCentered}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      open={isOpen}
    >
      <Fade in={isOpen}>
        <Box className={classes.modalContainer}>
          <Box className={classes.modalContent}>
            <IconButton
              className={classes.closeModalButton}
              onClick={closeModal}
            >
              <CloseIcon />
            </IconButton>
            <Box className={classes.row}>
              {getIcon(imageStatus)}
              <Typography>
                Uploading Image to IPFS
              </Typography>
            </Box>
            <Box className={classes.row}>
              {getIcon(metaDataStatus)}
              <Typography>
                Uploading Metadata to IPFS
              </Typography>
            </Box>
            <Box className={classes.row}>  
              {getIcon(NFTStatus)}
              <Typography>
                Minting NFT
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default LoadingModal;