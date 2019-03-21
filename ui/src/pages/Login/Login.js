import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import Link from '@material-ui/core/Link';

import { GOOGLE_CLIENT_ID } from '../../config';
import { login, loginGoogle } from '../../services/usersService';

import { saveUser } from '../../actions';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    marginTop: theme.spacing.unit * 3
  },
  link: {
    cursor: 'pointer',
    marginTop: theme.spacing.unit * 3,
  }
});

class Login extends Component {
  state = {
    loginView: true,
    snackbarMessage: null,
  }
  
  responseGoogleSuccess = async (response) => {
    console.log('google', response);
    try {
      const res = await loginGoogle({ token: response.accessToken });
      console.log('res', res, res.data);
      this.props.saveUser(res.data);
    } catch (e) {
      console.log(e);
      this.setState({snackbarMessage: 'Error al ingresar con google'});
    }
  }

  responseGoogleFailure = (response) => {
    console.log('error', response);
  }

  submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ 
        email: e.target.email.value,
        password: e.target.password.value,
      });
      console.log('res', res, res.data)
      this.props.saveUser(res.data);
    } catch (e) {
      this.setState({snackbarMessage: 'Correo no valido'});
      console.log(e);
    }
  }

  signUp = () => {
    this.setState({ loginView: false });
  }

  render() {
    const { classes } = this.props;
    return (
      this.props.user ? 
      <Redirect to="/" /> : this.state.loginView ? (
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            <GoogleLogin
              className={classes.button}
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Iniciar sesión con Google"
              onSuccess={this.responseGoogleSuccess}
              onFailure={this.responseGoogleFailure}
            />
            <form className={classes.form} onSubmit={this.submit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Correo electrónico</InputLabel>
                <Input id="email" name="email" autoComplete="email" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Contraseña</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="current-password" />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Entrar
              </Button>
            </form>
            <Link
              className={classes.link}
              onClick={this.signUp} >
              Crear una cuenta
            </Link>
          </Paper>
          <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
        </main>
      ) : <Redirect to="/signup" />
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {
  saveUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Login));
