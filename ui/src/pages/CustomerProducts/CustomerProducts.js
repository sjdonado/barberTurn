import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getAll } from '../../services/userProductsService';
import ProductCardQR from '../../components/ProductCardQR';

const styles = theme => ({
  content: {
    display: 'flex',
    marginTop: 58,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

class CustomerProducts extends Component {
  state = {
    products: []
  }

  async componentDidMount() {
    try {
      const res = await getAll();
      console.log(res.data);
      this.setState({ products: res.data.reverse() })
    } catch(e) {
      console.log(e);
    }
  }
  
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {this.state.products.map((userProduct, index) => (
          <ProductCardQR key={index} userProduct={userProduct}/>
        ))}
      </main>
    );
  }
}

CustomerProducts.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CustomerProducts));