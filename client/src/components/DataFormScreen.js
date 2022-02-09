import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { makeStyles } from '@mui/styles';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import BottomButtonRow from './BottomButtonRow';
import { status, dimensions } from '../utils/constants';
import { upload } from '../nft/upload';

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: dimensions.SCREEN_HEIGHT,
    margin: '0 auto',
    padding: '64px 0',
    textAlign: 'center',
    width: dimensions.SCREEN_WIDTH,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 32,
  },
  img: {
    margin: 'auto',
  },
});

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Please enter a title'),
  description: yup
    .string()
    .required('Please enter a description'),
});

const DataFormScreen = ({ navigateToVideoScreen, canvasImage }) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema,
    onSubmit: async ({ title, description }) => {
      upload(canvasImage);
    }
  });
  
  return (
    <Box className={classes.container}>
      <img
        className={classes.img}
        src={canvasImage}
        height={dimensions.SCREEN_HEIGHT}
        width={dimensions.SCREEN_WIDTH}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box className={classes.form}>
          <TextField
            id="title"
            label="Title"
            name="title"
            variant="outlined"
            margin="normal"
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.title}
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            id="description"
            label="Description"
            name="description"
            variant="outlined"
            className={classes.textField}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            value={formik.values.description}
            error={formik.touched.description && !!formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Box>
      </form>
      <BottomButtonRow
        onClickLeftButton={navigateToVideoScreen}
        onClickRightButton={formik.handleSubmit}
        screenStatus={status.DATA_FORM_SCREEN}
      />
    </Box>
  );
};

export default DataFormScreen;
