import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  CircularProgress,
  Fade,
  Switch,
  IconButton
} from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import CloseIcon from '@mui/icons-material/Close';
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
  row: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  }
});

const ConfigPanel = ({
  isOpen,
  config,
  setConfig,
  closeConfigPanel,
}) => {
  const classes = useStyles();
  const {
    isGreenScreenEnabled,
    isDigitalPropsEnabled,
    shouldDisplayRGControls,
  } = config;

  const handleSwitch = e => {
    const { name, checked } = e.target;
    setConfig({
      ...config,
      [name]: checked,
    })
  };

  return (
    <Modal
      className={classes.modalCentered}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      open={isOpen}
    >
      <Box className={classes.modalContainer}>
        <IconButton
          className={classes.closeModalButton}
          onClick={closeConfigPanel}
        >
          <CloseIcon />
        </IconButton>
        <Box>
          <Typography>Green Screen On/Off</Typography>
          <Box>
            <Switch
              name="isGreenScreenEnabled"
              checked={isGreenScreenEnabled}
              onChange={handleSwitch}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
        </Box>
        {isGreenScreenEnabled && (
          <Box>
            <Typography>Display RG Color Controls</Typography>
            <Box>
              <Switch
                name="shouldDisplayRGControls"
                checked={shouldDisplayRGControls}
                onChange={handleSwitch}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
          </Box>
        )}
        <Box>
          <Typography>Network Options</Typography>
          <Box>
            <Typography>Ethereum</Typography>
            <Typography>Polygon</Typography>
            <Typography>Cardano</Typography>
          </Box>
        </Box>
        <Box>
          <Typography>Digital Props On/Off</Typography>
          <Box>
            <Switch
              name="isDigitalPropsEnabled"
              checked={isDigitalPropsEnabled}
              onChange={handleSwitch}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
};

export default ConfigPanel;