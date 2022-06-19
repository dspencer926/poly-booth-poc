import React, { useState, useRef } from 'react';import {
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = (logo) => makeStyles({
  container: {
    display: 'flex',
    minWidth: 500,
    minHeight: 500,
  },
  logo: {
    // backgroundImage: `url("${logo}")`,
    // backgroundSize: 'cover',
    height: '100%',
    width: '100%',
  }
});

const MainLogoContainer = ({ logo }) => {
  const classes = useStyles(logo)();

  return (
    <Box className={classes.container}>
      <img src={logo} className={classes.logo}/>
    </Box>
  );
};

export default MainLogoContainer;