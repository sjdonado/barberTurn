import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import QrReader from "react-qr-reader";

import { get, setStatus } from '../../services/turnsService';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import TurnCard from '../../components/TurnCard';

const styles = theme => ({
  root: {
    marginTop: '64px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    flex: '1 1 50%',
    marginLeft: '16px',
    backgroundColor: theme.palette.background.paper,
  },
  cameraDiv: {
    flex: '1 1 50%',
    maxWidth: '50%',
    maxHeight: '120px',
  },
  section2: {
    margin: theme.spacing.unit * 2,
  },
});

class QrRegister extends Component {
  state = {
    delay: 1000,
    openSnackbar: false,
    snackbarMessage: null,
    turn: null,
  };
  
  handleScan = async id => {
    if (id) {
      try {
        const res = await get(id);
        console.log(res.data);
        this.setState({
          openSnackbar: true,
          snackbarMessage: `Lectura registrada correctamente`,
          turn: res.data,
        });
      } catch(e) {
        console.log(e);
      }
    }
  }

  handleAcceptClick = async () => {
    try {
      const res = await setStatus(this.state.turn._id, { status: 'accepted' });
      this.setState({ 
        turn: Object.assign(this.state.turn, { status: res.status }),
        snackbarMessage: 'Turno aceptado correctamente',
       });
    } catch(err) {
      console.log(err);
      this.setState({ snackbarMessage: 'Error al aceptar el turno.' });
    }
  };

  handleRejectClick = async () => {
    try {
      const res = await setStatus(this.state.turn._id, { status: 'rejected' });
      this.setState({
        turn: Object.assign(this.state.turn, { status: res.status }),
        snackbarMessage: 'Turno rechazado correctamente.',
      });
    } catch(err) {
      console.log(err);
      this.setState({ snackbarMessage: 'Error al rechazar el turno.' });
    }
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.root}>
        <Typography variant="h4" gutterBottom component="h2">
          Registrar turno
        </Typography>
        <div className={classes.content}>
          <div className={classes.cameraDiv}>
            <QrReader
              delay={this.state.delay}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "100%" }}
            />
          </div>
          { this.state.turn ? 
            <div className={classes.card}>
              <TurnCard turn={this.state.turn} user={true} />
              <Divider variant="middle" />
              <div className={classes.section2}>
                <Button
                  disabled={this.state.turn.status !== 'new'}
                  fullWidth
                  onClick={this.handleAcceptClick}
                  variant="contained"
                  color="primary">
                  Aceptar
                </Button>
              </div>
              <div className={classes.section2}>
                <Button
                  disabled={this.state.turn.status !== 'new'}
                  fullWidth
                  onClick={this.handleRejectClick}
                  variant="contained"
                  color="primary">
                  Rechazar
                </Button>
              </div>
            </div> : null
          }
        </div>
        <SimpleSnackbar open={this.state.openSnackbar} message={this.state.snackbarMessage}/>
      </main>
    );
  }
}

QrRegister.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QrRegister));