import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  countdown: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '100%',
    display: 'flex',
    height: 164,
    justifyContent: 'center',
    position: 'absolute',
    width: 164,
  },
  count: {
    color: 'white',
  }
});

const Countdown = ({ count }) => {
  const classes = useStyles();
  return (
    <Box className={classes.countdown}>
      <Typography variant="h1" className={classes.count}>
        {count}
      </Typography>
    </Box>
  );
};

export default Countdown;