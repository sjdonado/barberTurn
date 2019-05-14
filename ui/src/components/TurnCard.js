import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

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

class TurnCard extends Component {

  render() {
    const { classes, turn, user } = this.props;
    return (
      <div>
        <img className={classes.coverImg}
          src={user ? turn.user.profilePicture.url : turn.company.profilePicture.url}
          alt="Cover" />
        <div className={classes.container}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h5">
                {user ? turn.user.name : turn.company.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
                {moment(turn.selectedDate).format('LLLL')}
              </Typography>
            </Grid>
          </Grid>
          <Qualify quantity={turn.qualify} />
          {/* <Typography color="textSecondary">
            { secondaryText }
          </Typography> */}
          <Typography color="textSecondary">
            {turn.description}
          </Typography>
        </div>
      </div>
    )
  }
}

TurnCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TurnCard);
