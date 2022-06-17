export function getElementPosition(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
  }
  return undefined;
};

export function getEventLocation(element,event) {
  // Relies on the getElementPosition function.
  var pos = getElementPosition(element);
  
  return {
    x: (event.pageX - pos.x),
      y: (event.pageY - pos.y)
  };
};

export function filterPixels(canvasContext, config) {
  const imageData = canvasContext.getImageData(0, 0, 600, 600);
  const data = imageData.data;
  for(let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1]; 
    if (green > config.gColorValue && red < config.rColorValue) {
      data[i + 3] = 0;
    }
  }
  const newCanvas = document.createElement('canvas')
  newCanvas.height = 600;
  newCanvas.width = 600;
  const newCanvasCtx = newCanvas.getContext('2d');
  newCanvasCtx.putImageData(imageData, 0, 0);
  return newCanvas.toDataURL();
};