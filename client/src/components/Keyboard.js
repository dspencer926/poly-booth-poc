import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { lowerCaseKeys, upperCaseKeys } from '../utils/constants';

  /*  KEYBOARD  */

  /* KEYBOARD ANIMATION */

  // .keyboard-enter {
  //   bottom: -50%;
  // }
  
  // .keyboard-enter.keyboard-enter-active {
  //   bottom: 30%;
  //   transition: bottom 500ms ease-in;
  // }
  
  // .keyboard-leave {
  //   bottom: 30%;
  // }
  
  // .keyboard-leave.keyboard-leave-active {
  //   bottom: -50%;
  //   transition: bottom 500ms ease-in;
  // }

  // .keyboard-appear {
  //   bottom: -50%;
  // }
  
  // .keyboard-appear.keyboard-appear-active {
  //   bottom: 30%;
  //   transition: bottom 500ms ease-in;
  // }



const useStyles = makeStyles({
  keyboardDiv: {
    display: 'flex',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: '0%',
    padding: '25px 0',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    zIndex: '2',
  },
  keyboard: {
    width: '900px',
    fontSize: '1.7em',
    fontWeight: '800',
    color: 'white',
  },
  keyboardRow: {
    display: 'flex',
    width: '100%',
  },
  key: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    boxSizing: 'border-box',
    borderRadius: '15px',
    padding: '25px',
    margin: 5,
    backgroundColor: 'gray',
    boxShadow: '5px 5px 5px black',
  },
  'key:active': {
    boxShadow: 'none',
  },
  row1: {
    padding: '0 10px 0 0',
  },
  row2: {
    padding: '0 20px',
  },
  row3: {
    paddingLeft: '50px',
  },
  row4: {
    paddingLeft: '20px',
  },
  row5: {
    justifyContent: 'space-around',
  },
  space: {
    width: '400px',
  },
  uppercaseShift: {
    color: 'blue',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  }
});

const Keyboard = () => {
  const classes = useStyles();
  const [isShifted, setIsShifted] = useState(false);
  const [keys, setKeys] = useState(lowerCaseKeys);

  useEffect(() => {
    if (isShifted) {
      setKeys(upperCaseKeys);
    } else {
      setKeys(lowerCaseKeys);
    }
  }, [isShifted])

  const clickKey = (e) => {
    let key = e.target.innerHTML;
    this.props.handleInput(key);
  }

  return (
    <div className={classes.keyboardDiv}>
      <div className={`${classes.flexColumn} ${classes.keyboard}`}>
        {keys.map((val1, key1) => {
          return <div className={`${classes[`row${key1 + 1}`]} ${classes.flexRow} ${classes.keyboardRow}`} key={key1}>
              {val1.map((val2, key2) => {
                let style;
                if (val2 === '^') {
                  style = isShifted && classes.uppercaseShift
                }
              return <div className={`${classes.key} ${style} ${val2}`} key={key2} onClick={clickKey}>{val2}</div>
              })}
          </div>
        })}
      </div>
    </div>
  );
}

export default Keyboard;
