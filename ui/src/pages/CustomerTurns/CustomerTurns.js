import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getAll } from '../../services/userPromotionsService';
import TurnCardQR from '../../components/TurnCardQR';

const styles = theme => ({
  content: {
    display: 'flex',
    marginTop: 58,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

class CustomerTurns extends Component {
  state = {
    promotions: []
  }

  async componentDidMount() {
    try {
      const res = await getAll();
      console.log(res.data);
      this.setState({ promotions: res.data.reverse() })
    } catch(e) {
      console.log(e);
    }
  }
  
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {this.state.promotions.map((userProduct, index) => (
          <TurnCardQR key={index} userProduct={userProduct}/>
        ))}
      </main>
    );
  }
}

CustomerTurns.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CustomerTurns));