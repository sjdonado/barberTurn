import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { getCustomers } from '../../services/userProductsService';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: '50px',
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
  },
});

class CompanyCustomers extends Component {
  state = {
    productsUsers: [],
  };

  async componentWillMount() {
    try {
      const res = await getCustomers();
      console.log(res.data)
      this.setState({ productsUsers: res.data })
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <List className={classes.content}>
        {this.state.productsUsers.map((productUsers, index) => (
          <ListItem className={classes.card} alignItems="flex-start" key={index}>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={productUsers.user.profilePicture.url} />
            </ListItemAvatar>
            <ListItemText
              primary={productUsers.user.name}
              secondary={
                <React.Fragment>
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Producto: {productUsers.product.name}
                  </Typography>
                  Cantidad: {productUsers.quantity}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    )
  }
}

CompanyCustomers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyCustomers);
