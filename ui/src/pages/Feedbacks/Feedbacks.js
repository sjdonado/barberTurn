import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { getAll } from '../../services/feedbacksService';
import FeedbacksTable from '../../components/FeedbacksTable';
import SimpleSnackbar from '../../components/SimpleSnackbar';

import { savePromotion, removePromotion } from '../../actions';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  container: {
    marginTop: '16px',
    marginBottom: '16px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  modalTitle: {
    margin: '16px 0',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flex: '0 0 100%',
  },
  rowParent: {
    display: 'flex',
    flexDirection: 'row',
  },
  middleTextField: {
    flex: '1 1 50%',
  },
  content: {
    marginTop: '50px',
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  topRightIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bigAvatar: {
    display: 'block',
    width: 150,
    height: 150,
    margin: 'auto',
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
  }
});

class Feedbacks extends Component {
  state = {
    errorMessage: null,
    feedbacks: [],
  };

  async componentWillMount() {
    try {
      const res = await getAll();
      console.log(res.data)
      this.setState({ feedbacks: res.data.reverse() });
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <FeedbacksTable data={this.state.feedbacks}/>
        <SimpleSnackbar open={this.state.errorMessage != null} message={this.state.errorMessage}/>
      </main>
    )
  }
}

Feedbacks.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  promotion: state.promotion,
});

const mapDispatchToProps = {
  savePromotion,
  removePromotion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feedbacks));