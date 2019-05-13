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
import { create, update, remove, getAllByBusiness } from '../../services/productsService';
import EnhancedTable from '../../components/EnhancedTable';
import ProductCard from '../../components/ProductCard';
import SimpleSnackbar from '../../components/SimpleSnackbar';

import { saveProduct, removeProduct } from '../../actions';


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

const initialProduct = {
  name: '',
  description: '',
  price: '',
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
    viewProduct: null,
    errorMessage: null,
    products: [],
    product: Object.assign({}, initialProduct),
  };

  async componentWillMount() {
    try {
      const res = await getAllByBusiness();
      console.log(res.data)
      this.setState({ products: res.data.reverse() });
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
      viewProduct: null,
      file: null,
      fileUrl: null,
      sending: false,
      errorMessage: null,
      product: Object.assign({}, initialProduct),
    });
  };

  handleProductChange = prop => event => {
    this.setState({ product: Object.assign(this.state.product, { [prop]: event.target.value }) });
  };

  handleViewProduct = event => {
    this.setState({ viewProduct: this.props.product, createOrUpdateModalOpen: true });
  }

  handleEditProduct = event => {
    this.setState({ createOrUpdateModalType: 'edit', createOrUpdateModalOpen: true, product: this.props.product });
  }

  handleDeleteProduct = async event => {
    try {
      const res = await remove(this.props.product._id);
      console.log(res, res.data._id);
      if (res.data) this.setState({ products: this.state.products.filter(elem => elem._id !== res.data._id)});
      this.props.removeProduct();
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
      formData.append('name', this.state.product.name);
      formData.append('description', this.state.product.description);
      formData.append('price', this.state.product.price);
      formData.append('quantity', this.state.product.quantity);
      try {
        switch (this.state.createOrUpdateModalType) {
          case 'create':
            console.log('FILE', this.state.file);
            const product = await create(formData);
            if (product.data) this.setState({ products: [product.data, ...this.state.products], file: null });
            break;
          case 'edit':
            const updatedProduct = await update(formData, this.state.product._id);
            console.log(updatedProduct.data);
            const products = this.state.products.map(elem => {
              if (elem._id === updatedProduct.data._id) return updatedProduct.data;
              return elem;
            });
            if (updatedProduct.data) this.setState({ products, file: null });
            this.props.removeProduct();
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
        <EnhancedTable data={this.state.products} handleViewProduct={this.handleViewProduct} handleEditProduct={this.handleEditProduct} handleDeleteProduct={this.handleDeleteProduct}/>
        <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleOpen}>
          <AddIcon />
        </Fab>
        <Modal
          aria-labelledby="product-modal-title"
          aria-describedby="product-modal-description"
          open={this.state.createOrUpdateModalOpen}
          onClose={this.handleClose}>
          <div>
            {this.state.sending && <LinearProgress />}
            <div className={classes.paper}>
              <IconButton className={classes.topRightIcon} aria-label="Close" onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h4" className={classes.modalTitle}>
                {this.state.viewProduct ? 'Detalles' : this.state.createOrUpdateModalType === 'create' ? 'Nuevo producto': 'Editar producto'}
              </Typography>
              {/* <Divider variant="middle" fullWidth/> */}
              { this.state.viewProduct ? <ProductCard product={this.state.viewProduct} /> :
                <div>
                  <img className={classes.bigAvatar}
                    src={this.state.product.coverPicture.url || this.state.fileUrl}
                    alt="Avatar" />
                  <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
                    <input
                      id="file-input"
                      type="file"
                      onChange={this.onFileChange} />
                    <TextField
                      required
                      id="outlined-product-name"
                      label="Nombre"
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                      value={this.state.product.name}
                      onChange={this.handleProductChange('name')}/>
                    <TextField
                      required
                      id="outlined-textarea-description"
                      label="Descripción"
                      multiline
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                      value={this.state.product.description}
                      onChange={this.handleProductChange('description')}/>
                    <div className={classes.rowParent}>
                      <TextField
                        required
                        id="outlined-product-price"
                        className={classes.middleTextField}
                        variant="outlined"
                        label="Precio"
                        value={this.state.product.price}
                        onChange={this.handleProductChange('price')}
                        margin="normal"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}/>
                      <TextField
                        required
                        id="outlined-number-quantity"
                        label="Cantidad"
                        value={this.state.product.quantity}
                        onChange={this.handleProductChange('quantity')}
                        type="number"
                        className={classes.middleTextField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"/>
                    </div>
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
  product: state.product,
});

const mapDispatchToProps = {
  saveProduct,
  removeProduct,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));