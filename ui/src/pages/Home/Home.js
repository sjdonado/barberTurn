import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CompanyCard from '../../components/CompanyCard';
import CompanyPromotions from '../../components/CompanyPromotions';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RateReviewIcon from '@material-ui/icons/RateReview';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { getCompanies } from '../../services/usersService';
import Tooltip from '@material-ui/core/Tooltip';
import FeedbackDialog from '../../components/FeedbackDialog';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import SimpleSnackbar from '../../components/SimpleSnackbar';

import { create as createTurn } from '../../services/turnsService';
import { create as createFeedback } from '../../services/feedbacksService';

const styles = theme => ({
  root: {
    marginTop: 70,
  },
  content: {
    marginLeft: 25,
  },
  companies: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 20,
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  feedback: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: '1 1 0%',
  },
  container: {
    marginTop: '16px',
    marginBottom: '16px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  modalTitle: {
    margin: '16px 0',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flex: '0 0 100%',
  },
  rowParent: {
    display: 'flex',
    flexDirection: 'row',
  },
  middleTextField: {
    flex: '1 1 50%',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
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
  bigAvatar: {
    display: 'block',
    width: 150,
    height: 150,
    margin: 'auto',
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
  }
});

const initialTurn = {
  selectedDate: new Date(),
  description: '',
};

class Home extends Component {
  state = {
    companies: [],
    company: null,
    feedback: false,
    createTurnModalOpen: false,
    snackbarMessage: null,
    promotion: null,
    turn: Object.assign({}, initialTurn),
  };

  async componentDidMount() {
    try {
      const res = await getCompanies();
      this.setState({ companies: res.data.reverse() })
    } catch(e) {
      console.log(e);
    }
  }

  handleCompanyClick = company => this.setState({ company });

  handleBackClick = e => this.setState({ company: null });

  feedbackClickHandler = () => this.setState({ feedback: true });

  closeFeedbackDialog = async (data) => {
    this.setState({ feedback: false })
    if (data) {
      data.businessId = this.state.company.id;
      try {        
        await createFeedback(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleTurnChange = prop => event => {
    this.setState({ turn: Object.assign(this.state.turn, { [prop]: event.target.value }) });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log()
      await createTurn(Object.assign(this.state.turn, { company: this.state.company.id, promotion: this.state.promotion._id }));
      this.setState({ snackbarMessage: 'Turno guardado correctamente!' });
    } catch(e) {
      console.log(e);
      this.setState({ snackbarMessage: 'Error al crear el turno' });
    }
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
      createTurnModalOpen: false,
      promotion: null,
      turn: Object.assign({}, initialTurn),
    });
  };

  handleDateChange = date => {
    this.setState({ turn: Object.assign(this.state.turn, { selectedDate: date } )});
  };

  promotionClickListener = promotion => {
    console.log('promotion', promotion);
    this.setState({ createTurnModalOpen: true, promotion })
  }

  render() {
    const { classes } = this.props;
    return (
      this.state.company ? (
        <div className={classes.root}>
          <div className={classes.header}>
            <Tooltip title="Calificar" aria-label="Calificar">            
              <IconButton className={classes.button}
                aria-label="Atrás"
                onClick={this.handleBackClick}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h4">
              {this.state.company.name}
            </Typography>
            {/* <div className={classes.feedback}>
              <IconButton className={classes.button}
                aria-label="Calificar" 
                onClick={this.feedbackClickHandler}>
                  <RateReviewIcon />
              </IconButton>
            </div> */}
          </div>
          <CompanyPromotions company={this.state.company} selected={this.state.promotion} clickListener={this.promotionClickListener} />
          <Fab color="primary" aria-label="Nuevo turno" className={classes.fab} onClick={() => this.setState({ createTurnModalOpen: true })}>
            <AddShoppingCartIcon />
          </Fab>
          <Modal
            aria-labelledby="turn-modal-title"
            aria-describedby="turn-modal-description"
            open={this.state.createTurnModalOpen}
            onClose={this.handleClose}>
            <div>
              {this.state.sending && <LinearProgress />}
              <div className={classes.paper}>
                <IconButton className={classes.topRightIcon} aria-label="Close" onClick={this.handleClose}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" className={classes.modalTitle}>
                  Nuevo turno
                </Typography>
                  <div>
                    {this.state.promotion && (
                      <Typography gutterBottom variant="subtitle1">
                        <b>Promoción:</b> { this.state.promotion.name }
                      </Typography>
                    )}
                    <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container className={classes.grid} justify="space-around">
                          <DatePicker
                            margin="normal"
                            label="Fecha"
                            value={this.state.turn.selectedDate}
                            onChange={this.handleDateChange}/>
                          <TimePicker
                            margin="normal"
                            label="Hora"
                            value={this.state.turn.selectedDate}
                            onChange={this.handleDateChange}/>
                        </Grid>
                      </MuiPickersUtilsProvider>
                      <TextField
                        id="outlined-textarea-comments"
                        label="Comentarios"
                        multiline
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        value={this.state.turn.comments}
                        onChange={this.handleTurnChange('comments')}/>
                      <Button
                        type="submit"
                        disabled={this.state.sending}
                        className={classes.submit}
                        variant="contained"
                        color="primary"
                        margin="normal"
                        fullWidth>
                        Guardar
                      </Button>
                    </form>
                  </div>
              </div>
            </div>
          </Modal>
          {/* <FeedbackDialog open={this.state.feedback}
            onClose={this.closeFeedbackDialog} /> */}
          <SimpleSnackbar open={this.state.snackbarMessage != null} message={this.state.snackbarMessage}/>
        </div>
      ) : (
        <div className={classes.root}>
          <div className={classes.content}>
            <Typography variant="h4">
              Barberías
            </Typography>
          </div>
          <div className={classes.companies}>
            {this.state.companies.map((company, index) => (
              <CompanyCard className={classes.card}
                company={company} key={index}
                handleCompanyClick={this.handleCompanyClick}/>
            ))}
          </div>
        </div>
      )
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Home);