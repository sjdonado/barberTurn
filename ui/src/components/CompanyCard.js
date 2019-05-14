import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  item: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
    paddingRight: 20, 
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
    transition: '0.5s',
  },
  coverImg: {
    height: 150,
  },
  container: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  name: {
    width: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
});

class CompanyCard extends Component {

  state = {
    company: this.props.company,
  };

  handleCompanyClick = e => {
    this.props.handleCompanyClick(this.state.company)
  }

  render() {
    const { classes, company } = this.props;
    return (
      <div className={classes.item} onClick={this.handleCompanyClick}>
        <img className={classes.coverImg}
        src={company.profilePicture.url}
        alt="Cover" />
        <div className={classes.container}>
          <Typography className={classes.name} gutterBottom variant="h5">
            {company.name}
          </Typography>
          <Typography color="textSecondary">
            Horas: {company.startTime} - {company.endTime}
          </Typography>
        </div>
      </div>
    )
  }
}

CompanyCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyCard);
