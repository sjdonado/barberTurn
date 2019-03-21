import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StarRatingComponent from 'react-star-rating-component';

const styles = theme => ({
  margin: {
    marginLeft: 5,
  }
});

class Qualify extends Component {

  render() {
    const { classes, quantity, users } = this.props;
    return (
      <Grid container alignItems="center">
        <Grid item>
          <StarRatingComponent 
            name="rate" 
            editing={false}
            starCount={5}
            value={quantity / users === 0 ? 1 : users}
          />
        </Grid>
        <Grid item className={classes.margin}>
          <Typography gutterBottom variant="caption">
            { Math.round((quantity / users === 0 ? 1 : users) * 100) / 100 }
          </Typography>
        </Grid>
        <Grid item className={classes.margin}>
          <Typography gutterBottom variant="caption">
            ({users})
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

Qualify.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Qualify);
