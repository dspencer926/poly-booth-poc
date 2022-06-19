import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
  },
  page: {
    background: '#fff',
    boxSizing: 'border-box',
    minHeight: '100vh',
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