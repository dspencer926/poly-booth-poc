import { useState, useEffect } from 'react';
import { dimensions } from '../utils/constants';

const useScreen = ({                        
  videoRef,
  canvasRef,
  setCanvasImage,

}) => {
  const [count, setCount] = useState(null);                       //  number shown for count
  const [videoDimensions, setVideoDimensions] = useState({});     //  dimensions to use for canvas
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const videoToCanvas = () => {
    let canv = canvasRef.current.getContext('2d');
    let v = videoRef.current;
    if (v.paused || v.ended) return false;
    const height = dimensions.SCREEN_HEIGHT;
    const width = height * (1 + 1/3);
    const start = ((width - height) / 2) * -1;
    canv.drawImage(v, start, 0, width, height);
    const overlay = new Image();
    overlay.src = '/overlay';
    canv.drawImage(overlay, -125, -125);
    setTimeout(videoToCanvas, 20);
  };

  const startCountdown = () => {
    if (isFrozen) {
      videoRef.current.play();
      videoToCanvas(); 
      setIsFrozen(false);
    }
    setCount(3);
    setIsCountingDown(true);
  };

  const confirmPic = () => {
    const canv = canvasRef.current.getContext('2d');
    setCanvasImage(canvasRef.current.toDataURL('image/jpg'));
  };

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
    if (count === 0) {
      videoRef.current.pause();
      setCount(null);
      setIsFrozen(true);
      setIsCountingDown(false);
    }
  }, [count]);
  
  useEffect(() => {
    let constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      setVideoDimensions({
        height: videoRef.height,
        width: videoRef.width,
      })
      videoRef.current.play();
      videoToCanvas();              
    })
  }, [videoRef]);

  return {
    count,
    startCountdown,
    isCountingDown,
    isFrozen,
    confirmPic,
  };
}

export default useScreen;