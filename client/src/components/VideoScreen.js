import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { status, dimensions } from '../utils/constants';
import Countdown from './Countdown';
import useScreen from '../hooks/useScreen';
import BottomButtonRow from './BottomButtonRow';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  screen: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 36,
  },
  canvas: {
    borderRadius: 32,
  },
  video: {
    display: 'none',
  },
});

const VideoScreen = ({
  navigateToPropScreen,
  setCanvasImage,
  socket,
}) => {
  const classes = useStyles();
  const videoRef = useRef();
  const canvasRef = useRef();
  const {
    startCountdown,
    count,
    isCountingDown,
    isFrozen,
    confirmPic,
  } = useScreen({
    videoRef,
    canvasRef,
    setCanvasImage,
    socket,
  });

  const goToPropScreen = () => {
    confirmPic();
    navigateToPropScreen();
  };

  return (
    <Box className={classes.container}>
      <div className={classes.screen}>
        {!!count && <Countdown count={count} />}
        <canvas
          className={classes.canvas}
          ref={canvasRef}
          height={dimensions.SCREEN_HEIGHT}
          width={dimensions.SCREEN_WIDTH}
        />
        <video className={classes.video} ref={videoRef} />
      </div>
      <BottomButtonRow
        onClickCenterButton={startCountdown}
        onClickRightButton={goToPropScreen}
        screenStatus={status.VIDEO_SCREEN}
        isFrozen={isFrozen}
        isCountingDown={isCountingDown}
      />
    </Box>
  );
};

export default VideoScreen;