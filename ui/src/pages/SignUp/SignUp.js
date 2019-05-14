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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import Link from '@material-ui/core/Link';
import Switch from '@material-ui/core/Switch';
import './SignUp.scss';

import Utils from '../../utils';
import { create, createGoogleOauth } from '../../services/usersService';
import { GOOGLE_CLIENT_ID } from '../../config';


import { saveUser } from '../../actions';

const styles = theme => ({
  main: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    placeContent: 'center', 
  },
  paper: {
    overflow: 'auto',
    maxWidth: ' 320px',
    maxHeight: '600px',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '500px',
    },
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
  },
  switch: {
    textAlign: 'right',
  },
  switchFormControlLabel: {
    margin: 0,
  },
  bigAvatar: {
    margin: '10px auto',
    width: 150,
    height: 150,
  },
  name: {
    textAlign: 'center',
  }
});

class SignUp extends Component {
  state = {
    signUpView: true,
    role: false,
    file: null,
    fileUrl: null,
    snackbarMessage: null,
    googleAuth: null,
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked, snackbarMessage: null });
  };

  onFileChange = e => {
    this.setState({ file: e.target.files[0] });
    Utils.getFileUrl(e.target.files[0], (fileUrl) => {
      this.setState({ fileUrl });
    })
  }

  responseGoogleSuccess = async (response) => {
    console.log('google', response);
    this.setState({ googleAuth: response, fileUrl: response.profileObj.imageUrl });
  }

  responseGoogleFailure = (response) => {
    console.log(response);
  }
  
  submit = async (e) => {
    e.preventDefault();
    if (this.state.googleAuth) {
      try {
        const data = {
          email: this.state.googleAuth.accessToken,
          name: this.state.googleAuth.profileObj.name,
          profilePictureUrl: this.state.fileUrl,
        };
        if (this.state.role) Object.assign(data, { nit: e.target.nit.value, role: true });
        const res = await createGoogleOauth(data);
        console.log('res', res, res.data)
        this.props.saveUser(res.data);
      } catch (e) {
        this.setState({snackbarMessage: 'User already exists'});
        console.log(e);
      }
    } else {
      const formData = new FormData();
      if (this.state.file) formData.append('file', this.state.file, this.state.file.name);
      formData.append('name', e.target.name.value);
      formData.append('email', e.target.email.value);
      formData.append('password', e.target.password.value);
      try {
        if (this.state.role) {
          formData.append('nit', e.target.nit.value);
          formData.append('role', true);
        }
        const res = await create(formData);
        console.log('res', res, res.data)
        this.props.saveUser(res.data);
      } catch (e) {
        this.setState({snackbarMessage: 'El usuario ya existe'});
        console.log(e);
      }
    }
  }

  login = () => {
    this.setState({ signUpView: false });
  }

  render() {
    const { classes } = this.props;
    return (
      this.props.user ? 
      <Redirect to="/" /> : this.state.signUpView ? (
        <div className="wrapper">
          <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
              <div className="paper-content">
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Registro
                </Typography>
                <GoogleLogin
                  className={classes.button}
                  clientId={GOOGLE_CLIENT_ID}
                  buttonText="Registrarse con Google"
                  onSuccess={this.responseGoogleSuccess}
                  onFailure={this.responseGoogleFailure}
                />
                <form className={classes.form} onSubmit={this.submit}>
                  <div className={classes.switch}>
                    <FormControlLabel
                      className={classes.switchFormControlLabel}
                      control={
                        <Switch
                          checked={this.state.role}
                          onChange={this.handleChange('role')}
                          value="role" />
                      }
                      label='Establecimiento'
                    />
                  </div>
                  <Avatar alt="Profile picture" src={this.state.fileUrl} className={classes.bigAvatar} />
                  {
                    !this.state.googleAuth ? (
                      <div>
                        <input
                          id="file-input"
                          type="file"
                          onChange={this.onFileChange} />
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="name">Nombre</InputLabel>
                          <Input id="name" name="name" autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="email">Correo electrónico</InputLabel>
                          <Input id="email" name="email" />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="password">Contraseña</InputLabel>
                          <Input name="password" type="password" id="password" />
                        </FormControl>
                      </div>
                    ) : (
                      <Typography className={classes.name}>
                        {this.state.googleAuth.profileObj.name}
                      </Typography>
                    )
                  }
                  {
                    this.state.role && 
                    (<FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="nit">NIT</InputLabel>
                      <Input id="nit" name="nit" autoComplete="nit" autoFocus/>
                    </FormControl>)
                  }
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Continuar
                  </Button>
                </form>
                <Link
                  className={classes.link}
                  onClick={this.login} >
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            </Paper>
            <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
          </main>
        </div>
      ) : <Redirect to="/login" />
    )
  }
}

SignUp.propTypes = {
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
)(withStyles(styles)(SignUp));
