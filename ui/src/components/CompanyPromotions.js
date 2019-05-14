import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import PromotionCardForm from './PromotionCardForm';
import Typography from '@material-ui/core/Typography';


import { create } from '../services/userPromotionsService';
import { getAllPromotions } from '../services/promotionsService';

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

class CompanyPromotions extends Component {
  state = {
    promotions: [],
  };

  async componentDidMount() {
    try {
      const res = await getAllPromotions(this.props.company.id);
      this.setState({ promotions: res.data.reverse() });
    } catch(e) {
      console.log(e);
    }
  }

  handleSubmit = async promotion => {
    try {
      await create(promotion);
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      this.state.promotions.length > 0 ? (
        <main className={classes.content}>
          {this.state.promotions.map(n => (
            <PromotionCardForm className={classes.card} promotion={n} key={n._id} handleSubmit={this.handleSubmit}/>
          ))}
        </main>
      ) : (
        <Typography className={classes.message} gutterBottom variant="h6">
          No se han encontrado promociones.
        </Typography>
      )
    )
  }
}

CompanyPromotions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyPromotions);