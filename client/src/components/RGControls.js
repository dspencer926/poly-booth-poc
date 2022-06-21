import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 'auto',
    padding: 24,
    position: 'relative',
    width: 'fit-content',
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  }
});

const RGControls = ({
  config,
  setConfig,
  applyGreenScreen,
}) => {
  const classes = useStyles();
  const {
    gColorValue,
    rColorValue,
  } = config;

  const decrementRed = () => setConfig({ ...config, rColorValue: rColorValue - 5 });
  const incrementRed = () => setConfig({ ...config, rColorValue: rColorValue + 5 });
  const decrementGreen = () => setConfig({ ...config, gColorValue: gColorValue - 5 });
  const incrementGreen = () => setConfig({ ...config, gColorValue: gColorValue + 5 });

  useEffect(() => {
    applyGreenScreen();
  }, [config.gColorValue, config.rColorValue]);

  return (
    <Box className={classes.modalContainer}>
      <Box>
        <Typography>Green Screen Values</Typography>
        <Box className={classes.row}>
          <Typography>R</Typography>
          <IconButton

            onClick={decrementRed}
          >
            <IndeterminateCheckBoxRoundedIcon />
          </IconButton>
          <Typography>{rColorValue}</Typography>
          <IconButton

            onClick={incrementRed}
          >
            <AddBoxRoundedIcon />
          </IconButton>
        </Box>
        <Box className={classes.row}>
          <Typography>G</Typography>
          <IconButton

            onClick={decrementGreen}
          >
            <IndeterminateCheckBoxRoundedIcon />
          </IconButton>
          <Typography>{gColorValue}</Typography>
          <IconButton
            onClick={incrementGreen}
          >
            <AddBoxRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
};

export default RGControls;