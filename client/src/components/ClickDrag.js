import React, { useState, useRef, useEffect } from 'react';
import DraggableImage from './DraggableImage';
import Mustache from '../assets/digital-props/mustache.png';
// import Buttons from './Buttons'

const ClickDrag = ({ canvasImage, setImage }) => {
  // const [imageCoords, setImageCoords] = useState({ x: 0, y: 0 });
  const [mouseDownCoords, setMouseDownCoords] = useState({ x: 0, y: 0 });
  const [originalImage, setOriginalImage] = useState();
  const [action, setAction] = useState();
  const [currentlyActive, setCurrentlyActive] = useState();
  // const [isDragging, setIsDragging] = useState();
  const [images, setImages] = useState();
  const [imageCount, setImageCount] = useState();
  const [digitalPropNames, setDigitalPropNames] = useState();

  const canvasRef = useRef();

  useEffect(() => {
    // fetch('/digitalprops/file_names', {
    //   method: 'GET',
    // }).then(res => {
    //   console.log(res);
    //   return res.json();
    // }).then(json => {
      setDigitalPropNames({ digitalPropNames: ['mustache.png'] })
    // });

    const ctx = canvasRef.current.getContext('2d');
    const newImage = new Image(720, 720);
    newImage.src = canvasImage;
    newImage.onload = () => {
      ctx.drawImage(newImage, 0, 0);
      setOriginalImage(newImage);
    }
  }, []);



  const refresh = () => {
    let ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);
    for (var image in images) {
      let instance = images[image]
      ctx.drawImage(instance.canv, 0, 0);
    }
  }

  const checkItems = (x, y) => {             // loops thru all props to see if user clicked on one
    let zIndex = 0;
    let imageName = null;
    for (var image in images) {
      let instance = images[image]
      console.log('instance', instance)
      if (withinBox(x, y, instance)) 
        { if (instance.zIndex > zIndex) imageName = instance.name }
    }
    return imageName;
  }

  const withinBox = (xp, yp, instance) => { 
    console.log(instance)      // tests if user clicked within item box
    const c = instance.corners;
    const one = calc(c.nw.x, c.nw.y, c.ne.x, c.ne.y, xp, yp);
    const two = calc(c.ne.x, c.ne.y, c.se.x, c.se.y, xp, yp);
    const three = calc(c.se.x, c.se.y, c.sw.x, c.sw.y, xp, yp);
    const four = calc(c.sw.x, c.sw.y, c.nw.x, c.nw.y, xp, yp);
    if (one && two && three && four) return true;    
    return false;   
  }

  const calc = (x1, y1, x2, y2, xp, yp) => {      // calculation to be used with withinBox
    const A = -(y2 - y1);
    const B = x2 - x1;
    const C = - ((A * x1) + (B * y1));  
    const D = (A * xp) + (B * yp) + C;  
    const result = D > 0;
    return result;
    
  }

  const handleMouseDown = (e, type = 'click') => {
    const x = type === 'touch'
      ? e.touches[0].clientX - canvasRef.current.offsetLeft
      : e.clientX - canvasRef.current.offsetLeft;
    const y = type === 'touch'
      ? e.touches[0].clientY - canvasRef.current.offsetTop
      : e.clientY - canvasRef.current.offsetTop;
    const imageName = checkItems(x, y);
    if (imageName) {
      if (!images[imageName].selected) {
        images[imageName].select();
        refresh();
      }
      const mode = images[imageName].mode(x, y);
      console.log('##mode: ', mode);
      const obj = { x, y }
      setAction(mode);
      setCurrentlyActive(imageName);
      setMouseDownCoords(obj)
    } else {
      if (currentlyActive) {
        const imageKeys = Object.keys(images);
        imageKeys.forEach(val => images[val].deselect());
        refresh();
        setAction(null);
        setCurrentlyActive(null);
      }
    }
  }

  const handleMouseUp = () => setAction(null);

  const handleMouseMove = (e, type = 'click') => {
    let currentMouseDownCoords = mouseDownCoords;
    let canv = document.getElementById('canv');
    let ctx = canv.getContext('2d');
    let offsetX = type === 'touch' ? e.touches[0].clientX - canv.offsetLeft : e.clientX - canv.offsetLeft;
    let offsetY = type === 'touch' ? e.touches[0].clientY - canv.offsetTop : e.clientY - canv.offsetTop;
    let mouseMovementX = offsetX - currentMouseDownCoords.x;
    let mouseMovementY = offsetY - currentMouseDownCoords.y;
    if (action) {
      let active = images[currentlyActive];
      switch (action) {
        case 'move': {
          active.move(mouseMovementX, mouseMovementY)
          let currentCoords = { x: offsetX, y: offsetY }
          setMouseDownCoords(currentCoords);
          // figure this one out withh useEffect or something
          // this.setState({
          //   mouseDownCoords: currentCoords,
          // }, () => {refresh()})
        }
        break;
        case 'resize': {
          active.resize(mouseMovementX, mouseMovementY) // make function return canvas
          let canv = active.canv;
          let currentCoords = { x: offsetX, y: offsetY }
          setMouseDownCoords(currentCoords);
          // figure this one out withh useEffect or something
          // this.setState({
          //   mouseDownCoords: currentCoords,
          // }, () => {refresh()})
        }
          break;
        case 'rotate': {
          active.rotate(offsetX, offsetY);
          let canv = active.canv;
          let currentCoords = { x: offsetX, y: offsetY }
          setMouseDownCoords(currentCoords);
          // figure this one out withh useEffect or something
          // this.setState({
          //   mouseDownCoords: currentCoords,
          // }, () => {refresh()})
        }
      }
    }
  }

  const addPic = async (e) => {                       // adds new prop when user clicks one
    const zIndex = imageCount + 1;
    setImageCount(zIndex)
    const name = `${e.target.id}-${Math.floor(Math.random() * 10000000)}`;
    let newPic = new DraggableImage(name, e.target);
    console.log('##draggableImage: ', newPic);
    newPic.location();
    const obj = { ...images };
    obj[newPic.name] = newPic;
    obj[newPic.name].zIndex = zIndex;
    console.log("##obj: ", obj)
    setImages(obj);
    const ctx = canvasRef.current.getContext('2d');
    console.log("##ctx: ", ctx)
    newPic = await newPic.generate();
    console.log('##newPic: ', newPic);
    ctx.drawImage(originalImage, 0, 0);
    ctx.drawImage(newPic, 125, 125);
  }

  const finalizePic = () => {
    if (currentlyActive) {
      images[currentlyActive].deselect();
      refresh();
    }
    let editCanv = document.getElementById('edit-canv')
    let editCtx = editCanv.getContext('2d');
    editCtx.drawImage(this.canv, 0, 0);
    // let file = editCanv.toDataURL('image/jpg');
    // get gif from multiple images w/ digital props
    // also get thumbnail
    // this.props.getFiles(file, undefined, 'Share');
  }

  return (
    <div className='click-drag-container'>
      <div className='click-drag'
      style={{margin: 'auto'}}
      >
        <canvas 
          id='canv' 
          width='720'
          height='720' 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove} 
          onTouchStart={(e) => handleMouseDown(e, 'touch')}
          onTouchEnd={handleMouseUp}
          onTouchMove={(e) => handleMouseMove(e, 'touch')}
          ref={canvasRef}
        />
        <canvas
          id='edit-canv'
          width='720'
          height='720'
          style={{display: 'none'}}
        />
        <div id='digital-props'>
          <img
            className='digital-prop-thumbnail'
            src={Mustache} 
            id={'mustache'}
            // key={img}
            onClick={addPic}
            height="200"
            width="200"
          />
          {/* {digitalPropNames?.length && digitalPropNames.map(img => {
          
            return (
              <img
                className='digital-prop-thumbnail'
                src={`../assets/digital-props/mustache.png`} 
                id={img}
                key={img}
                onClick={addPic}
              />
            )
          })} */}
        </div>
      </div>
      {/* <Button
        finalizePic={finalizePic}
        btnStatus={'digitalProps'}
      /> */}
    </div>
  );
};

export default ClickDrag;