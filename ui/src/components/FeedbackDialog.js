import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StarRatingComponent from 'react-star-rating-component';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class FeedbackDialog extends Component {
  state = {
    rating: 0,
    message: undefined,
  };

  handleClose = (cancel) => {
    const data = cancel ? null : { ...this.state };
    this.props.onClose(data);
    this.setState({ rating: 0, message: undefined });
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const open = this.props.open;
    return (
      <Dialog
        open={open}
        onClose={() => this.props.onClose(null)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Calificar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Califica a la barbería
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            value={this.state.message}
            margin="dense"
            id="message"
            label="Mensaje"
            onChange={this.handleChange('message')}
            type="text"
            fullWidth />
          <div>
            <StarRatingComponent 
              name="rate" 
              editing={true}
              starCount={5}
              value={this.state.rating}
              onStarClick={this.onStarClick.bind(this)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> this.handleClose(true)} color="primary">
            Cancelar
          </Button> 
          <Button onClick={()=> this.handleClose()} color="primary">
            Calificar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FeedbackDialog;
