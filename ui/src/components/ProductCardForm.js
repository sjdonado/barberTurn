import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import SimpleSnackbar from './SimpleSnackbar';
import ProductCard from './ProductCard';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 340,
    margin: 10,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
    transition: '0.5s',
  },
  chip: {
    marginRight: theme.spacing.unit,
  },
  fab: {
    float: 'right',
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  section1: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  quantity: {
    margin: theme.spacing.unit * 2,
  },
  buyButton: {
    margin: theme.spacing.unit,
  }
});

class ProductCardForm extends Component {
  state = {
    quantity: '',
    purchase: false,
    openSnackbar: false,
    snackbarMessage: null,
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, openSnackbar: false });
  };

  handlePurchase = e => {
    this.setState({ purchase: !this.state.purchase })
  }

  handleSubmit = event => {
    event.preventDefault();
    if(this.state.quantity <= this.props.product.quantity) {
      this.props.handleSubmit({ quantity: this.state.quantity, productId: this.props.product._id });
      this.props.product.quantity = this.props.product.quantity - this.state.quantity;
      this.setState({
        openSnackbar: true,
        snackbarMessage: `${this.props.product.name} agregado correctamente`,
        quantity: '',
        purchase: false,
      });
    } else {
      this.setState({
        openSnackbar: true,
        snackbarMessage: `Error al agregar ${this.props.product.name}, cantidad máxima: ${this.props.product.quantity}`
      });
    }
  }

  render() {
    const { classes, product } = this.props;
    return (
      // style={getCardStyle()}
      <div className={classes.root}>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <ProductCard product={product} secondaryText={`Cantidad disponible: ${product.quantity}`}/>
          {
            !this.state.purchase && (
              <Fab
                color="primary"
                aria-label="Add"
                disabled={product.quantity <= 0}
                className={classes.fab}
                onClick={this.handlePurchase} >
                <AddShoppingCartIcon />
              </Fab>
            )
          }
          { this.state.purchase && (
            <div>
              <div className={classes.quantity}>
                <TextField
                  required
                  id="outlined-number-quantity"
                  label="Cantidad"
                  value={this.state.quantity}
                  onChange={this.handleChange('quantity')}
                  type="number"
                  className={classes.middleTextField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth/>
                {/* <div>
                  <Chip className={classes.chip} label="Extra Soft" />
                  <Chip className={classes.chip} label="Soft" />
                  <Chip className={classes.chip} label="Medium" />
                  <Chip className={classes.chip} label="Hard" />
                </div> */}
              </div>
              <div className={classes.buyButton}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth>
                  Comprar
                </Button>
              </div>
            </div>
          )}
        </form>
        <SimpleSnackbar open={this.state.openSnackbar} message={this.state.snackbarMessage}/>
      </div>
    )
  }
}

ProductCardForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCardForm);
