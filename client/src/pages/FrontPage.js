import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Screen from '../components/VideoScreen';
import DataFormScreen from '../components/DataFormScreen';
import InstructionScreen from '../components/InstructionScreen';
import { status } from '../utils/constants';

const FrontPage = () => {
  const [screenStatus, setScreenStatus] = useState(status.VIDEO_SCREEN);
  const [canvasImage, setCanvasImage] = useState(null);
  const [txId, setTxId] = useState(null);
  const navigateToVideoScreen = () => setScreenStatus(status.VIDEO_SCREEN);
  const navigateToDataFormScreen = () => setScreenStatus(status.DATA_FORM_SCREEN);
  const navigateToInstructionScreen = () => setScreenStatus(status.INSTRUCTION_SCREEN);
  
  return (
    <Container>
      {screenStatus === status.VIDEO_SCREEN && (
        <Typography variant="h3" align="center">
          Welcome to Poly Booth!
        </Typography>
      )}
      {screenStatus === status.VIDEO_SCREEN && (
        <Screen
          navigateToPropScreen={navigateToDataFormScreen}
          setCanvasImage={setCanvasImage}
        />
      )}
      {screenStatus === status.DATA_FORM_SCREEN && (
        <DataFormScreen
          navigateToVideoScreen={navigateToVideoScreen}
          navigateToInstructionScreen={navigateToInstructionScreen}
          canvasImage={canvasImage}
          setTxId={setTxId}
        />
      )}
      {screenStatus === status.INSTRUCTION_SCREEN && (
        <InstructionScreen
          txId ={txId}
          navigateToVideoScreen={navigateToVideoScreen}
          canvasImage={canvasImage}
        />
      )}
    </Container>
  )
}

export default FrontPage;
