import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getAll } from '../../services/turnsService';
import TurnCardQR from '../../components/TurnCardQR';

const styles = theme => ({
  content: {
    display: 'flex',
    marginLeft: 25,
    marginTop: 58,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

class CustomerTurns extends Component {
  state = {
    promotions: [],
    loading: true
  }

  async componentDidMount() {
    try {
      const res = await getAll();
      console.log(res.data);
      this.setState({ turns: res.data.reverse(), loading: false })
    } catch(e) {
      console.log(e);
    }
  }
  
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
      {this.state.loading && <LinearProgress />}
        <div className={classes.appBarSpacer} />
        { this.state.turns && this.state.turns.length > 0 ? (
          this.state.turns.map((turn, index) => (
            <TurnCardQR key={index} turn={turn}/>
          ))
        ) : (
          <div className={classes.root}>
            <div className={classes.content}>
              { !this.state.loading && (
                <Typography variant="h4">
                  No has selecionado turnos aún :(
                </Typography>
              )}
            </div>
          </div>
        )}
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