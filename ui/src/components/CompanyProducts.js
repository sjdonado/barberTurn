import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ProductCardForm from './ProductCardForm';
import Typography from '@material-ui/core/Typography';


import { create } from '../services/userProductsService';
import { getAllProducts } from '../services/productsService';

const styles = theme => ({
  content: {
    display: 'flex',
    marginTop: 20,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  message: {
    margin: 50,
  }
});

class CompanyProducts extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    try {
      const res = await getAllProducts(this.props.company.id);
      this.setState({ products: res.data.reverse() });
    } catch(e) {
      console.log(e);
    }
  }

  handleSubmit = async product => {
    try {
      const res = await create(product);
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      this.state.products.length > 0 ? (
        <main className={classes.content}>
          {this.state.products.map(n => (
            <ProductCardForm className={classes.card} product={n} key={n._id} handleSubmit={this.handleSubmit}/>
          ))}
        </main>
      ) : (
        <Typography className={classes.message} gutterBottom variant="h6">
          No se han encontrado productos.
        </Typography>
      )
    )
  }
}

CompanyProducts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyProducts);