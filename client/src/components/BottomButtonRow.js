import React from 'react';
import { Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { status, copy, dimensions } from '../utils/constants';

const useStyles = makeStyles({
  container: {
    '&.MuiGrid-root': {
      margin: 'auto',
      width: dimensions.SCREEN_WIDTH,
    }
  },
  leftBox: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  middleBox: {
    textAlign: "center",
  },    
  rightBox: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    boxSizing: 'border-box',
    height: 96,
    padding: 36,
  },
  centerButton: {
    width: 96,
  },
  rightButton: {
    width: 142,
  },
});

const RowButton = ({ label, onClick, classes, endIcon, disabled, }) => (
  <Button
    className={classes}
    color="primary"
    variant="contained"
    onClick={onClick}
    disabled={disabled}
    size="large"
    endIcon={endIcon}
  >
    {label}
  </Button>
);


const BottomButtonRow = ({
  onClickLeftButton,
  onClickCenterButton,
  onClickRightButton,
  screenStatus,
  isFrozen
}) => {
  const classes = useStyles();

  const buttonData = {
    [status.VIDEO_SCREEN]: {
      center: {
        label: isFrozen ? copy.RETAKE : copy.TAKE_PICTURE,
        classes: `${classes.button} ${classes.centerButton}`,
      },
      right: {
        label: copy.NEXT,
        classes: `${classes.button} ${classes.rightButton}`,
        endIcon: <NavigateNextIcon />,
        shouldHide: !isFrozen,
      },
    },
    [status.DATA_FORM_SCREEN]: {
      left: {
        label: copy.BACK,
        classes: `${classes.button} ${classes.rightButton}`,
        startIcon: <NavigateBeforeIcon />,
      },
      right: {
        label: copy.NEXT,
        classes: `${classes.button} ${classes.rightButton}`,
        endIcon: <NavigateNextIcon />,
      },
    }
  };
  
  return (
    <Grid container className={classes.container}>
      <Grid className={classes.leftBox} item md={4}>
        {buttonData[screenStatus].left && (
          <RowButton
            onClick={onClickLeftButton}
            {...buttonData[screenStatus].left}
          />
        )}
      </Grid>
      <Grid className={classes.middleBox} item md={4}>
        {buttonData[screenStatus].center && (
          <RowButton
            onClick={onClickCenterButton}
            {...buttonData[screenStatus].center}
          />
        )}
      </Grid>
      <Grid className={classes.rightBox} item md={4}>
        {!buttonData[screenStatus].right?.shouldHide && (
          <RowButton
            onClick={onClickRightButton}
            {...buttonData[screenStatus].right}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default BottomButtonRow;
