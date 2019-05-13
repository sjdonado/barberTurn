import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import CameraRollIcon from '@material-ui/icons/CameraRoll';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StarRateIcon from '@material-ui/icons/StarRate';
// import SimpleLineChart from '../../components/SimpleLineChart';

import routes from '../../routes';

import { logout } from '../../services/usersService';
import { removeUser } from '../../actions';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
    cursor: 'pointer',
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  menu: {
    marginTop: '47px',
  },
  avatar: {
    marginRight: 10,
  }
});

class DefaultLayout extends Component {
  state = {
    open: true,
    anchorEl: null,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = async () => {
    this.setState({ anchorEl: null });
    try {
      const res = await logout();
      console.log('res', res, res.data)
      this.props.removeUser();
    } catch (e) {
      this.setState({snackbarMessage: 'Unauthorized user'});
      console.log(e);
    }
  }

  redirectByRole = () => this.props.user.role ? <Redirect from="/" to="/dashboard" /> : <Redirect from="/" to="/home" />

  render() {
    const { classes, user } = this.props;
    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}>
              <MenuIcon />
              </IconButton>
              <Typography
                className={classes.title}
                component="h1"
                variant="h6"
                color="inherit"
                noWrap >
                Inicio
              </Typography>
              <Avatar alt={user.name} src={user.profilePicture.url} className={classes.avatar}/>
              <Typography
                component="h2"
                color="inherit"
                className={classes.menuButton}
                aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuClick}
                noWrap>
                {user.email} ▾
              </Typography>
              <Menu
                className={classes.menu}
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleMenuClose}>
                {/* <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem> */}
                <MenuItem onClick={this.handleMenuClose}>
                  <Link to="/profile">
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mi perfil"/>
                      </ListItem>
                    </List>
                  </Link>
                </MenuItem>
                <MenuItem onClick={this.handleLogout}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ExitToAppIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cerrar sesión"/>
                    </ListItem>
                  </List>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}>
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              {user.role ? (
                <div>
                  <Link to="/dashboard">
                    <ListItem button>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Inicio"/>
                    </ListItem>
                  </Link>
                  <Link to="/dashboard/register">
                    <ListItem button>
                      <ListItemIcon>
                        <CameraRollIcon />
                      </ListItemIcon>
                      <ListItemText primary="Registrar QR"/>
                    </ListItem>
                  </Link>
                  <Link to="/dashboard/customers">
                    <ListItem button>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Clientes"/>
                    </ListItem>
                  </Link>
                  <Link to="/dashboard/feedbacks">
                    <ListItem button>
                      <ListItemIcon>
                        <StarRateIcon />
                      </ListItemIcon>
                      <ListItemText primary="Calificaciones"/>
                    </ListItem>
                  </Link>
                </div>
                ) : (
                <div>
                  <Link to="/home">
                    <ListItem button>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Inicio"/>
                    </ListItem>
                  </Link>
                  <Link to="/home/products">
                    <ListItem button>
                      <ListItemIcon>
                        <ShoppingCartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mis productos"/>
                    </ListItem>
                  </Link>
                </div>
              )}
              {/* <ListItem button>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" onClick={this.handleLogout}/>
              </ListItem> */}
            </List>
          </Drawer>
          <main className={classes.content}>
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                  typeof route.role == 'undefined' || user.role === route.role ? <route.component /> : this.redirectByRole()
                )} />)
                  : (null);
              },
              )}
              { this.redirectByRole() }
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

DefaultLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {
  removeUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DefaultLayout));