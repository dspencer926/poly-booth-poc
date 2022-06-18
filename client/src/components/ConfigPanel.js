import React from 'react';
import {
  Box,
  Typography,
  Modal,
  Fade,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Button,
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
    isKeyboardEnabled,
    shouldDisplayRGControls,
    availableNetworks,
  } = config;
  const handleSwitch = e => {
    const { name, checked } = e.target;
    const newValues = {
      [name]: checked,
    }
    if (name === 'isGreenScreenEnabled' && !checked) {
      newValues.shouldDisplayRGControls = false;
    }
    setConfig({
      ...config,
      ...newValues,
    })
  };

  const handleCheckbox = e => {
    const { name, checked } = e.target;
    const newNetworks = [...availableNetworks];
    if (checked) {
      newNetworks.push(name);
    } else {
      if (availableNetworks.length <= 1) return;
      const index = newNetworks.indexOf(name);
      if (index > -1) {
        newNetworks.splice(index, 1);
      }
    }
    setConfig({
      ...config,
      availableNetworks: newNetworks,
    })
  };

  const enterFullscreen = () => document.documentElement.requestFullscreen();

  const exitFullscreen = () => document.exitFullscreen();


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
          <FormGroup>
            <FormControlLabel
              control={
              <Checkbox
                name="ethereum"
                checked={availableNetworks.includes('ethereum')}
                onChange={handleCheckbox}
              />
              }
              label="Ethereum" 
            />
            <FormControlLabel
              control={
              <Checkbox
                name="polygon"
                checked={availableNetworks.includes('polygon')}
                onChange={handleCheckbox}
              />
              }
              label="Polygon" 
            />
            <FormControlLabel
              control={
              <Checkbox
                name="cardano"
                checked={availableNetworks.includes('cardano')}
                onChange={handleCheckbox}
              />
              }
              label="Cardano" 
            />
          </FormGroup>
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
        <Box>
          <Typography>Keyboard On/Off</Typography>
          <Box>
            <Switch
              name="isKeyboardEnabled"
              checked={isKeyboardEnabled}
              onChange={handleSwitch}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
        </Box>
        <Button onClick={enterFullscreen}>Enter Fullscreen</Button>
        <Button onClick={exitFullscreen}>Exit Fullscreen</Button>
      </Box>
    </Modal>
  )
};

export default ConfigPanel;