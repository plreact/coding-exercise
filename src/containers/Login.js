import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { push } from 'connected-react-router';
import { func } from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setUserDetails } from '../actions/session';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles({
  loginLogo: {
    width: '50px',
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
  },
  loginCard: {
    padding: '2rem',
  },
});

const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export const Login = ({ loginUser, push }) => {
  const classes = useStyles();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isIsPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const {
      username: { value: usernameVal },
      password: { value: passwordVal },
    } = e.target.elements;
    if (usernameVal?.trim() === '') {
      setIsUsernameEmpty(true);
    } else {
      setIsUsernameEmpty(false);
    }
    if (passwordVal?.trim() === '') {
      setIsPasswordEmpty(true);
    } else {
      setIsPasswordEmpty(false);
    }
    try {
      setIsSubmitting(true);
      const loginResp = await axios.post('http://localhost:3001/api/login', {
        username: usernameVal,
        password: passwordVal,
      });
      const userDetails = loginResp.data;
      loginUser(userDetails);
      push('/');
      setIsSubmitting(false);
    } catch (error) {
      setIsSnackbarOpen(true);
      setIsSubmitting(false);
    }
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      className={classes.loginContainer}
    >
      <CssBaseline />
      <Card className={classes.loginCard}>
        <img
          alt="intelligence bank logo"
          src="/ib-logo.png"
          className={classes.loginLogo}
        />
        <Typography component="h1" variant="h5">
          Please log in below
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={isUsernameEmpty}
            helperText={isUsernameEmpty ? 'Please enter a valid username.' : ''}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={isIsPasswordEmpty}
            helperText={
              isIsPasswordEmpty ? 'Please enter a valid password.' : ''
            }
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            {isSubmitting ? (
              <CircularProgress data-testid="submitting-progress" />
            ) : (
              'Login'
            )}
          </Button>
          <Button type="reset" fullWidth color="default">
            Reset
          </Button>
        </form>
      </Card>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert onClose={() => setIsSnackbarOpen(false)} severity="error">
          Login Failed!
        </Alert>
      </Snackbar>
    </Container>
  );
};

Login.propTypes = {
  loginUser: func.isRequired,
  push: func.isRequired,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: userObj => dispatch(setUserDetails(userObj)),
    push: path => dispatch(push(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
