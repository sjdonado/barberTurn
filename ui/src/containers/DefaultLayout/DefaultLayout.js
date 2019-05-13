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
import Hidden from '@material-ui/core/Hidden';
// import SimpleLineChart from '../../components/SimpleLineChart';

import routes from '../../routes';

import { logout } from '../../services/usersService';
import { removeUser } from '../../actions';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  profileButton: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 20,
    },
  },
  menuButton: {
    marginRight: 20,
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
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
  },
  profileButton: {
    marginLeft: 12,
    marginRight: 36,
    cursor: 'pointer',
  },
});

class DefaultLayout extends Component {
  state = {
    open: false,
    anchorEl: null,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ open: !state.open }));
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
    const { classes, user, theme } = this.props;
    const drawer = (
      <div>
        <div className={classes.toolbarIcon}>
          <Typography
            style={{ paddingLeft: '16px', flexGrow: 1 }}
            component="h1"
            variant="h6"
            color="inherit"
            noWrap >
            BarberTurn
          </Typography>
          <IconButton onClick={this.handleDrawerClose}
            className={classes.menuButton}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {user.role ? (
            <div className="sidebar-buttons">
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
                  <ListItemText primary="Mis promociones"/>
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
      </div>
    );
    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar)}>
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}>
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
                className={classes.profileButton}
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
                  <Link to="/profile" className="link-button">
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
          <nav className={classes.drawer}>          
            <Hidden smUp implementation="css">
              <Drawer
                container={this.props.container}
                variant="temporary"
                anchor="left"
                open={this.state.open}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
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