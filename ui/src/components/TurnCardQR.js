import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import QRCode from 'qrcode.react';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import StarRatingComponent from 'react-star-rating-component';
import SimpleSnackbar from './SimpleSnackbar';

import TurnCard from './TurnCard';
import { Card } from '../styles/index';
import { setQualify } from '../services/turnsService';


const styles = theme => ({
  root: Object.assign({
    maxWidth: 340,
    margin: 10,
  }, Card.styles(theme).shadow),
  section1: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
  section2: {
    margin: theme.spacing.unit * 2,
  },
  qrCode: {
    display: 'block',
    margin: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  topRightIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  rating: {
    margin: '20px auto',
  },
});

class TurnCardQR extends Component {
  state = {
    openQR: false,
    openQualify: false,
    qualify: 0,
    snackbarMessage: null,
    turn: this.props.turn,
  };

  handleShowQrModal = () => {
    this.setState({ openQR: true });
  }

  handleShowQualifiyModal = () => {
    this.setState({ openQualify: true });
  }

  handleDownloadQr = () => {
    const qrCanvas = document.getElementById('qrCode');
    qrCanvas.toBlob((b) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.download = `barberturn-${this.state.turn.company.name}-${this.state.turn.selectedDate}-qr-code.png`;
      const url = window.URL.createObjectURL(b);
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    // console.log(this.refs.qrCode, )
  }

  handleQualify = async () => {
    try {
      const res = await setQualify(this.state.turn._id, { qualify: this.state.qualify });
      const { qualify, status } = res.data;
      this.setState({ 
        snackbarMessage: 'Calificación enviada correctamente',
        turn: Object.assign(this.state.turn, {
          qualify,
          status,
        }),
      });
    } catch (err) {
      console.log(err);
      this.setState({ snackbarMessage: 'Calificación enviada correctamente' });
    }
    this.handleCloseQualifyModal();
  }

  onStarClick = qualify => {
    this.setState({ qualify })
    console.log('qualify', qualify);
  }

  handleCloseQrModal = () => {
    this.setState({ openQR: false });
  }

  handleCloseQualifyModal = () => {
    this.setState({ openQualify: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TurnCard turn={this.state.turn} user={false} />
        <Divider variant="middle" />
        <div className={classes.section2}>
          {
            this.state.turn.status === 'new' ? (
              <Button
                fullWidth
                onClick={this.handleShowQrModal}
                variant="contained"
                color="primary">
                Ver código QR
              </Button>
            ) : (
              <Button
                fullWidth
                disabled={this.state.turn.status !== 'accepted'}
                onClick={this.handleShowQualifiyModal}
                variant="contained"
                color="primary">
                Calificar
              </Button>
            )
          }
        </div>
        <Modal
          aria-labelledby="turn-modal-title"
          aria-describedby="turn-modal-description"
          open={this.state.openQualify}
          onClose={this.handleCloseQualifyModal}>
          <div className={classes.paper}>
            <IconButton className={classes.topRightIcon} aria-label="Close" onClick={this.handleCloseQualifyModal}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className={classes.modalTitle}>Tu calificación</Typography>
            <StarRatingComponent 
              className={classes.rating}
              name="qualify" 
              starCount={5}
              value={this.state.qualify}
              onStarClick={this.onStarClick}
            />
            <Button
              fullWidth
              onClick={this.handleQualify}
              variant="contained"
              color="primary">
              Enviar
            </Button>
          </div>
        </Modal>
        <Modal
          aria-labelledby="turn-modal-title"
          aria-describedby="turn-modal-description"
          open={this.state.openQR}
          onClose={this.handleCloseQrModal}>
          <div className={classes.paper}>
            <IconButton className={classes.topRightIcon} aria-label="Close" onClick={this.handleCloseQrModal}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className={classes.modalTitle}>Código QR</Typography>
            <QRCode id="qrCode" value={this.state.turn._id} className={classes.qrCode}/>
            <Button
              fullWidth
              onClick={this.handleDownloadQr}
              variant="contained"
              color="primary">
              Descargar
            </Button>
          </div>
        </Modal>
        <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
      </div>
    )
  }
}

TurnCardQR.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TurnCardQR);
