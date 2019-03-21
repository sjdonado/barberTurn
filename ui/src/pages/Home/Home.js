import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CompanyCard from '../../components/CompanyCard';
import CompanyProducts from '../../components/CompanyProducts';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getCompanies } from '../../services/usersService';

const styles = theme => ({
  root: {
    marginTop: 70,
  },
  content: {
    marginLeft: 25,
  },
  companies: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 20,
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  }
});

class Home extends Component {
  state = {
    companies: [],
    company: null,
  };

  async componentDidMount() {
    try {
      const res = await getCompanies();
      console.log(res.data)
      this.setState({ companies: res.data.reverse() })
    } catch(e) {
      console.log(e);
    }
  }

  handleCompanyClick = company => this.setState({ company });

  handleBackClick = e => this.setState({ company: null });

  render() {
    const { classes } = this.props;
    return (
      this.state.company ? (
        <div className={classes.root}>
          <div className={classes.header}>
            <IconButton className={classes.button} aria-label="Atrás" onClick={this.handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">
              {this.state.company.name}
            </Typography>
          </div>
          <CompanyProducts company={this.state.company} />
        </div>
      ) : (
        <div className={classes.root}>
          <div className={classes.content}>
            <Typography variant="h4">
              Todos
            </Typography>
          </div>
          <div className={classes.companies}>
            {this.state.companies.map((company, index) => (
              <CompanyCard className={classes.card} company={company} key={index} handleCompanyClick={this.handleCompanyClick}/>
            ))}
          </div>
        </div>
      )
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Home);