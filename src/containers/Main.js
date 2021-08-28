import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { push } from 'connected-react-router';
import { bool, func } from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/session';
import AppToolbar from '../components/AppToolbar';



const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const LoginSuccessSnackBar = () => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true);
  return (
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={() => setIsSnackbarOpen(false)}
    >
      <Alert onClose={() => setIsSnackbarOpen(false)} severity="success">
        Login Success!
      </Alert>
    </Snackbar>
  );
};
function Main({ isLoggedIn, logout, push }) {
  const handleLogin = () => {
    push('/login');
  };

  return (
    <>
      <AppToolbar
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={logout}
      />
      {isLoggedIn && <LoginSuccessSnackBar />}
    </>
  );
}

Main.propTypes = {
  isLoggedIn: bool.isRequired,
  logout: func.isRequired,
  push: func.isRequired,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.getIn(['session', 'username']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    push: path => dispatch(push(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
