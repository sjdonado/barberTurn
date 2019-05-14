import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';

import Utils from '../../utils';
import { create, update, remove, getAllByBusiness } from '../../services/promotionsService';
import EnhancedTable from '../../components/EnhancedTable';
import PromotionCard from '../../components/PromotionCard';
import SimpleSnackbar from '../../components/SimpleSnackbar';

import { savePromotion, removePromotion } from '../../actions';


const styles = theme => ({
  root: {
    display: 'flex',
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
  content: {
    marginTop: '50px',
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
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

const initialPromotion = {
  name: '',
  description: '',
  quantity: '',
  sending: false,
  coverPicture: {
    url: null,
  }
};

class Dashboard extends Component {
  state = {
    file: null,
    fileUrl: null,
    createOrUpdateModalOpen: false,
    createOrUpdateModalType: '',
    viewPromotion: null,
    errorMessage: null,
    promotions: [],
    promotion: Object.assign({}, initialPromotion),
  };

  async componentWillMount() {
    try {
      const res = await getAllByBusiness();
      this.setState({ promotions: res.data.reverse() });
    } catch(e) {
      console.log(e);
    }
  }

  handleOpen = () => {
    this.setState({ createOrUpdateModalType: 'create', createOrUpdateModalOpen: true });
  };

  handleClose = () => {
    this.setState({
      createOrUpdateModalOpen: false,
      viewPromotion: null,
      file: null,
      fileUrl: null,
      sending: false,
      errorMessage: null,
      promotion: Object.assign({}, initialPromotion),
    });
  };

  handlePromotionChange = prop => event => {
    this.setState({ promotion: Object.assign(this.state.promotion, { [prop]: event.target.value }) });
  };

  handleViewPromotion = event => {
    this.setState({ viewPromotion: this.props.promotion, createOrUpdateModalOpen: true });
  }

  handleEditPromotion = event => {
    this.setState({ createOrUpdateModalType: 'edit', createOrUpdateModalOpen: true, promotion: this.props.promotion });
  }

  handleDeletePromotion = async event => {
    try {
      const res = await remove(this.props.promotion._id);
      if (res.data) this.setState({ promotions: this.state.promotions.filter(elem => elem._id !== res.data._id)});
      this.props.removePromotion();
    } catch (e) {
      console.log(e);
    }
  }

  onFileChange = e => {
    this.setState({ file: e.target.files[0] });
    Utils.getFileUrl(e.target.files[0], (fileUrl) => {
      this.setState({ fileUrl });
    })
  }

  handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    if (this.state.file) {
      this.setState({ sending: true });
      formData.append('file', this.state.file, this.state.file.name)
      formData.append('name', this.state.promotion.name);
      formData.append('description', this.state.promotion.description);
      formData.append('quantity', this.state.promotion.quantity);
      try {
        switch (this.state.createOrUpdateModalType) {
          case 'create':
            console.log('FILE', this.state.file);
            const promotion = await create(formData);
            if (promotion.data) this.setState({ promotions: [promotion.data, ...this.state.promotions], file: null });
            break;
          case 'edit':
            const updatedPromotion = await update(formData, this.state.promotion._id);
            console.log(updatedPromotion.data);
            const promotions = this.state.promotions.map(elem => {
              if (elem._id === updatedPromotion.data._id) return updatedPromotion.data;
              return elem;
            });
            if (updatedPromotion.data) this.setState({ promotions, file: null });
            this.props.removePromotion();
            break;
          default:
            break;
        }
      } catch (e) {
        console.log(e);
      }
      this.handleClose();
    } else {
      this.setState({ errorMessage: 'Imagen requerida' });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <EnhancedTable data={this.state.promotions} handleViewPromotion={this.handleViewPromotion} handleEditPromotion={this.handleEditPromotion} handleDeletePromotion={this.handleDeletePromotion}/>
        <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleOpen}>
          <AddIcon />
        </Fab>
        <Modal
          aria-labelledby="promotion-modal-title"
          aria-describedby="promotion-modal-description"
          open={this.state.createOrUpdateModalOpen}
          onClose={this.handleClose}>
          <div>
            {this.state.sending && <LinearProgress />}
            <div className={classes.paper}>
              <IconButton className={classes.topRightIcon} aria-label="Close" onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h4" className={classes.modalTitle}>
                {this.state.viewPromotion ? 'Detalles' : this.state.createOrUpdateModalType === 'create' ? 'Nueva promoción': 'Editar promoción'}
              </Typography>
              {/* <Divider variant="middle" fullWidth/> */}
              { this.state.viewPromotion ? <PromotionCard promotion={this.state.viewPromotion} /> :
                <div>
                  <img className={classes.bigAvatar}
                    src={this.state.promotion.coverPicture.url || this.state.fileUrl} />
                  <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
                    <input
                      id="file-input"
                      type="file"
                      onChange={this.onFileChange} />
                    <TextField
                      required
                      id="outlined-promotion-name"
                      label="Nombre"
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                      value={this.state.promotion.name}
                      onChange={this.handlePromotionChange('name')}/>
                    <TextField
                      id="outlined-textarea-description"
                      label="Descripción"
                      multiline
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                      value={this.state.promotion.description}
                      onChange={this.handlePromotionChange('description')}/>
                    <TextField
                      required
                      id="outlined-number-quantity"
                      label="Cantidad"
                      value={this.state.promotion.quantity}
                      onChange={this.handlePromotionChange('quantity')}
                      type="number"
                      className={classes.middleTextField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      variant="outlined"/>
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
              }
            </div>
          </div>
        </Modal>
        <SimpleSnackbar open={this.state.errorMessage != null} message={this.state.errorMessage}/>
      </main>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  promotion: state.promotion,
});

const mapDispatchToProps = {
  savePromotion,
  removePromotion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));