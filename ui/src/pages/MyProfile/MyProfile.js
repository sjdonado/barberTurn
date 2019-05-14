import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

import Utils from '../../utils';
import { update } from '../../services/usersService';

import { saveUser } from '../../actions';

const styles = theme => ({
  root: {
    display: 'flex',
  },
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
  },
  switch: {
    float: 'right',
    marginRight: 0,
  },
  bigAvatar: {
    width: 150,
    height: 150,
  },
});

class MyProfile extends Component {
  constructor(props) {
    console.log('uSER', props.user);
    super(props);
  }
  state = {
    file: null,
    fileUrl: null,
    snackbarMessage: null,
    user: this.props.user,
  }

  submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (this.state.file) formData.append('file', this.state.file, this.state.file.name);
    formData.append('name', e.target.name.value);
    formData.append('email', e.target.email.value);
    formData.append('password', e.target.password.value);
    try {
      const res = await update(formData);
      Object.assign(res.data, {
        startTime: new Date(0, 0, 0, res.data.startTime.split(':')[0], res.data.startTime.split(':')[1]),
        endTime: new Date(0, 0, 0, res.data.endTime.split(':')[0], res.data.endTime.split(':')[1]),
      });
      this.props.saveUser(res.data);
      this.setState({snackbarMessage: 'Usuario actualizado correctamente.'});
    } catch (e) {
      this.setState({snackbarMessage: 'Error al actualizar el usuario.'});
      console.log(e);
    }
  }

  sumbitCompanyConfigs = async (e) => {
    e.preventDefault();
    console.log('USER', this.state.user);
    const formData = new FormData();
    formData.append('startTime', `${new Date(this.state.user.startTime).getHours()}:${new Date(this.state.user.startTime).getMinutes()}`);
    formData.append('endTime', `${new Date(this.state.user.endTime).getHours()}:${new Date(this.state.user.endTime).getMinutes()}`);
    try {
      const res = await update(formData);
      Object.assign(res.data, {
        startTime: new Date(0, 0, 0, res.data.startTime.split(':')[0], res.data.startTime.split(':')[1]),
        endTime: new Date(0, 0, 0, res.data.endTime.split(':')[0], res.data.endTime.split(':')[1]),
      });
      this.props.saveUser(res.data);
      this.setState({snackbarMessage: 'Configuración actualizada correctamente.'});
    } catch (e) {
      this.setState({snackbarMessage: 'Error al actualizar la configuración.'});
      console.log(e);
    }
  }

  handleStartTimeDateChange = date => {
    this.setState({ user: Object.assign(this.state.user, { startTime: date } )});
  };

  handleEndTimeDateChange = date => {
    this.setState({ user: Object.assign(this.state.user, { endTime: date } )});
  };

  onFileChange = e => {
    this.setState({ file: e.target.files[0] });
    Utils.getFileUrl(e.target.files[0], (fileUrl) => {
      this.setState({ fileUrl });
    })
  }

  handleInputChange = e => {
    console.log(this.state, e)
    this.setState({ 
      user: Object.assign(this.state.user, { [e.target.name]: e.target.value })
    });
  }

  login = () => {
    this.setState({ signUpView: false });
  }

  render() {
    console.log(this.state)
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <Avatar alt={this.state.user.name} src={this.state.fileUrl || this.state.user.profilePicture.url} className={classes.bigAvatar} />
            <form className={classes.form} onSubmit={this.submit} >
              <input
                id="file-input"
                type="file"
                onChange={this.onFileChange} />
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input id="name" name="name" value={this.state.user.name} onChange={this.handleInputChange} autoFocus />
              </FormControl>
              {
                this.state.user.role && 
                (<FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="nit">NIT</InputLabel>
                  <Input id="nit" name="nit" value={this.state.user.nit} onChange={this.handleInputChange} />
                </FormControl>)
              }
              {
                !this.state.user.googleAuth &&
                  <div>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Email Address</InputLabel>
                      <Input id="email" name="email" value={this.state.user.email} onChange={this.handleInputChange} />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <Input name="password" type="password" id="password" minLength="5" value={this.state.user.password} onChange={this.handleInputChange} />
                    </FormControl>
                  </div>
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Guardar
              </Button>
            </form>
          </Paper>
          <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
        </main>
        { this.state.user.role && <main className={classes.main}>
          <Paper className={classes.paper}>
            <form className={classes.form} onSubmit={this.sumbitCompanyConfigs} >
              <div className={classes.root}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container className={classes.grid} justify="space-around">
                    <TimePicker
                      margin="normal"
                      label="Hora de apertura"
                      value={this.state.user.startTime}
                      onChange={this.handleStartTimeDateChange}/>
                  </Grid>
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container className={classes.grid} justify="space-around">
                    <TimePicker
                      margin="normal"
                      label="Hora de cierre"
                      value={this.state.user.endTime}
                      onChange={this.handleEndTimeDateChange}/>
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Guardar
              </Button>
            </form>
          </Paper>
          <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
        </main>}
      </div>
    )
  }
}

MyProfile.propTypes = {
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
)(withStyles(styles)(MyProfile));
