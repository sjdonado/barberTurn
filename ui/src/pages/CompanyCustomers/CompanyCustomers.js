import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import Qualify from '../../components/Qualify';

import { getCustomers } from '../../services/userPromotionsService';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: 50,
    padding: theme.spacing.unit * 3,
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  statusContainer: {
    display: 'flex',
  },
  status: {
    marginRight: 10,
  }
});

class CompanyCustomers extends Component {
  state = {
    turns: [],
  };

  async componentWillMount() {
    try {
      const res = await getCustomers();
      this.setState({ turns: res.data });
      console.log('RES', this.state.turns.length );
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.turns.length > 0 ? (
          <List className={classes.content}>
            {this.state.turns.map((turn, index) => (
              <ListItem className={classes.card} alignItems="flex-start" key={index}>
                <ListItemAvatar>
                  <Avatar alt="Profile picture" src={turn.user.profilePicture.url} />
                </ListItemAvatar>
                <ListItemText
                  primary={turn.user.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" className={classes.inline} color="textPrimary">
                        {moment(turn.selectedDate).format('LLLL')}
                      </Typography>
                      Promoción: {turn.promotion ? turn.promotion.name : 'Minguna'}
                    </React.Fragment>
                  }
                />
                <div className={classes.statusContainer}>
                  <Typography component="span" className={classes.status} color="textPrimary">
                    { turn.status == 'new' ? 'Nuevo' : turn.status == 'accepted' ? 'Aceptado' : turn.status == 'rejected' ? 'Rechazado' : 'Calificado' }
                  </Typography>
                  {turn.status == 'qualified' && <Qualify quantity={turn.qualify} />}
                </div>
              </ListItem>
            ))}
          </List>
          ) : (
          <div className={classes.content}>
            <Typography variant="h4">No tienes clientes aún.</Typography>
          </div>
        )}
      </div>
    )
  }
}

CompanyCustomers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyCustomers);
