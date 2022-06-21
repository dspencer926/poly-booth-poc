import { useState, useEffect } from 'react';
import { dimensions } from '../utils/constants';
import { getEventLocation, filterPixels } from '../utils/helpers';
import backdropImage from '../assets/backdrop.png';

const useScreen = ({                        
  videoRef,
  canvasRef,
  setCanvasImage,
  config,
  overlay,
}) => {
  const [count, setCount] = useState(null);                       //  number shown for count
  const [videoDimensions, setVideoDimensions] = useState({});     //  dimensions to use for canvas
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  // const [greenColor, setGreenColor] = useState(null);

  const getColor = (event) => {
    // Get the coordinates of the click
    var eventLocation = getEventLocation(canvasRef.current, event);
    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = canvasRef.current.getContext('2d');
    var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
  
    // If transparency on the pixel , array = [0,0,0,0]
    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
        // Do something if the pixel is transparent
    }
    return pixelData;
    // Convert it to HEX if you want using the rgbToHex method.
    // var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
  };
  

  const onColorClick = (e) => {
    console.log('##getColor(e): ', getColor(e)); 
    if (isFrozen) {
      const greenColor = getColor(e);
      console.log('##greenColor: ', greenColor);
      // const canv = canvasRef.current.getContext('2d');
      // filterPixels(canvasRef, canv, greenColor);
    }
  }

  const videoToCanvas = () => {
    let canv = canvasRef.current.getContext('2d');
    let v = videoRef.current;
    if (v.paused || v.ended) return false;
    const height = dimensions.SCREEN_HEIGHT;
    const width = height * (1 + 1/3);
    const start = ((width - height) / 2) * -1;
    canv.drawImage(v, start, 0, width, height);
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
    setCanvasImage(canvasRef.current.toDataURL('image/jpg'));
  };

  const applyGreenScreen = () => {
    const canv = canvasRef.current.getContext('2d');
    const background = new Image(600, 600);
    background.src = backdropImage;
    const foreground = new Image(600, 600);
    const foregroundImage = filterPixels(originalImage, config);
    canv.clearRect(0, 0, 600, 600);
    foreground.src = foregroundImage;
    setTimeout(() => canv.drawImage(background, 0, 0), 100);
    setTimeout(() => canv.drawImage(foreground, 0, 0), 200);
    setTimeout(() => canv.drawImage(overlay, -125, -125), 300);
  }

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
    if (count === 0) {
      videoRef.current.pause();
      const canvasContext = canvasRef.current
      const newCanvas = document.createElement('canvas');
      newCanvas.height = 600;
      newCanvas.width = 600;
      const newCanvasContext = newCanvas.getContext('2d');
      newCanvasContext.drawImage(canvasContext, 0, 0);
      setCount(null);
      setIsFrozen(true);
      setIsCountingDown(false);
      setOriginalImage(newCanvasContext);
    }
  }, [count]);

  useEffect(() => {
    if (originalImage && config.isGreenScreenEnabled) applyGreenScreen();
  }, [originalImage, config.isGreenScreenEnabled]);
  
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

  // useEffect(() => {
  //   canvasRef.current.addEventListener('click', (e) => onColorClick(e));
  //   return () => canvasRef.current.removeEventListener('click', (e) => onColorClick(e));
  // }, [canvasRef]);

  return {
    count,
    startCountdown,
    isCountingDown,
    isFrozen,
    confirmPic,
    applyGreenScreen,
  };
}

export default useScreen;