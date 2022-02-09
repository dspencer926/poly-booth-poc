import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
  },
  page: {
    background: '#f9f9f9',
    boxSizing: 'border-box',
    height: '100vh',
    padding: 32,
  }
});

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* main content */}
      <div className={classes.page}>
        { children }
      </div>
    </div>
  );
};

export default Layout;