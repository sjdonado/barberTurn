import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Qualify from './Qualify';

const styles = theme => ({
  container: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    marginBottom: 0,  
  },
  coverImg: {
    width: '100%',
  },
  users: {
    marginLeft: 5,
  }
});

class PromotionCard extends Component {

  render() {
    const { classes, promotion, secondaryText } = this.props;
    return (
      <div>
        <img className={classes.coverImg}
        src={promotion.coverPicture.url}
        alt="Cover" />
        <div className={classes.container}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h5">
                {promotion.name}
              </Typography>
            </Grid>
          </Grid>
          {/* <Qualify quantity={promotion.qualify.quantity} users={promotion.qualify.users} /> */}
          {promotion.quantity > 0 ? (
            <Typography color="textSecondary">Cantidad disponible: {promotion.quantity}</Typography>
          ) : (
            <Typography color="textSecondary">Promoción agotada</Typography>
          )}
          <Typography color="textSecondary">
            {promotion.description}
          </Typography>
        </div>
      </div>
    )
  }
}

PromotionCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PromotionCard);
