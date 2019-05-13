import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CompanyCard from '../../components/CompanyCard';
import CompanyProducts from '../../components/CompanyProducts';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { getCompanies } from '../../services/usersService';
import Tooltip from '@material-ui/core/Tooltip';
import FeedbackDialog from '../../components/FeedbackDialog';
import { create as createFeedback } from '../../services/feedbacksService';

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
  },
  feedback: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: '1 1 0%',
  }
});

class Home extends Component {
  state = {
    companies: [],
    company: null,
    feedback: false,
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

  feedbackClickHandler = () => this.setState({ feedback: true });

  closeFeedbackDialog = async (data) => {
    this.setState({ feedback: false })
    if (data) {
      data.businessId = this.state.company.id;
      try {        
        await createFeedback(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      this.state.company ? (
        <div className={classes.root}>
          <div className={classes.header}>
            <Tooltip title="Calificar" aria-label="Calificar">            
              <IconButton className={classes.button}
                aria-label="Atrás"
                onClick={this.handleBackClick}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h4">
              {this.state.company.name}
            </Typography>
            <div className={classes.feedback}>
              <IconButton className={classes.button}
                aria-label="Calificar" 
                onClick={this.feedbackClickHandler}>
                  <RateReviewIcon />
              </IconButton>
            </div>
          </div>
          <CompanyProducts company={this.state.company} />
          <FeedbackDialog open={this.state.feedback}
            onClose={this.closeFeedbackDialog} />
        </div>
      ) : (
        <div className={classes.root}>
          <div className={classes.content}>
            <Typography variant="h4">
              Barberías
            </Typography>
          </div>
          <div className={classes.companies}>
            {this.state.companies.map((company, index) => (
              <CompanyCard className={classes.card}
                company={company} key={index}
                handleCompanyClick={this.handleCompanyClick}/>
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