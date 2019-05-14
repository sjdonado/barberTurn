import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes, { node } from 'prop-types';
import PromotionCard from './PromotionCard';
import Typography from '@material-ui/core/Typography';


import { create } from '../services/userPromotionsService';
import { getAllPromotions } from '../services/promotionsService';
import { blue } from '@material-ui/core/colors';

const styles = theme => ({
  content: {
    display: 'flex',
    marginTop: 20,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  message: {
    margin: 50,
  },
  available: {
    cursor: 'pointer',
    width: '100%',
    maxWidth: 340,
    margin: 10,
    paddingBottom: 20,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
    transition: '0.5s',
  },
  spent: {
    width: '100%',
    maxWidth: 340,
    margin: 10,
    paddingBottom: 20,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.22)',
  },
  selected: {
    position: 'relative',
    cursor: 'pointer',
    width: '100%',
    maxWidth: 340,
    margin: 10,
    paddingBottom: 20,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 14px 28px rgba(40,53,147,0.30), 0 10px 10px rgba(40,53,147,0.27)',
    transition: '0.5s',
    border: '2px dotted rgba(40,53,147,0.50)',
  }
});

class CompanyPromotions extends Component {
  state = {
    promotions: [],
    selected: null,
    index: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.state.selected) {
      if (nextProps.selected == null && this.state.index != null) {
        Object.assign(this.state.promotions[this.state.index], { quantity: this.state.promotions[this.state.index].quantity - 1});
      }
      this.setState({ selected: nextProps.selected });
    }
  }

  async componentDidMount() {
    try {
      const res = await getAllPromotions(this.props.company.id);
      this.setState({ promotions: res.data.reverse() });
    } catch(e) {
      console.log(e);
    }
  }

  select = async (promotion, index) => {
    if (promotion.quantity > 0) {
      const selected = promotion;
      this.setState({ selected, index });
      this.props.clickListener(selected);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      this.state.promotions.length > 0 ? (
        <main className={classes.content}>
          {this.state.promotions.map((n, idx )=> (
            <div className={this.state.selected == n._id ? classes.selected : n.quantity == 0 ? classes.spent : classes.available} key={n._id} onClick={()=> this.select(n, idx)}>
              <PromotionCard className={classes.card} promotion={n} secondaryText={`Cantidad disponible: ${n.quantity}`}/>
            </div>
            // <PromotionCardForm  promotion={n}  handleSubmit={this.handleSubmit}/>
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