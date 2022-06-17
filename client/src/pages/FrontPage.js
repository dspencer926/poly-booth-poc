import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Screen from '../components/VideoScreen';
import DataFormScreen from '../components/DataFormScreen';
import InstructionScreen from '../components/InstructionScreen';
import ConfigPanel from '../components/ConfigPanel';
import { status, defaultConfig } from '../utils/constants';
import io from 'socket.io-client';

const socket = io.connect('/');

const FrontPage = () => {
  const [screenStatus, setScreenStatus] = useState(status.VIDEO_SCREEN);
  const [canvasImage, setCanvasImage] = useState(null);
  const [txId, setTxId] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [config, setConfig] = useState(defaultConfig);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const navigateToVideoScreen = () => setScreenStatus(status.VIDEO_SCREEN);
  const navigateToDataFormScreen = () => setScreenStatus(status.DATA_FORM_SCREEN);
  const navigateToInstructionScreen = () => setScreenStatus(status.INSTRUCTION_SCREEN);
  const openConfigPanel = () => setIsConfigPanelOpen(true);
  const closeConfigPanel = () => setIsConfigPanelOpen(false);

  const onClickO = () => {
    if (clicks === 4) {
      setClicks(0);
      openConfigPanel();
    } else {
      setClicks(clicks + 1);
    }
  }

  return (
    <Container>
      {screenStatus === status.VIDEO_SCREEN && (
        <Typography variant="h3" align="center">
          Welcome to P
          <span onClick={onClickO}>o</span>
          ly Booth!
        </Typography>
      )}
      {screenStatus === status.VIDEO_SCREEN && (
        <Screen
          navigateToPropScreen={navigateToDataFormScreen}
          setCanvasImage={setCanvasImage}
          config={config}
          setConfig={setConfig}
        />
      )}
      {screenStatus === status.DATA_FORM_SCREEN && (
        <DataFormScreen
          navigateToVideoScreen={navigateToVideoScreen}
          navigateToInstructionScreen={navigateToInstructionScreen}
          canvasImage={canvasImage}
          setTxId={setTxId}
          socket={socket}
        />
      )}
      {screenStatus === status.INSTRUCTION_SCREEN && (
        <InstructionScreen
          txId ={txId}
          navigateToVideoScreen={navigateToVideoScreen}
          canvasImage={canvasImage}
        />
      )}
      <ConfigPanel
        isOpen={isConfigPanelOpen}
        config={config}
        setConfig={setConfig}
        closeConfigPanel={closeConfigPanel}
      />
    </Container>
  )
}

export default FrontPage;
