import React from 'react';
import Loadable from 'react-loadable'

// import Dashboard from './pages/Dashboard';
// import Home from './pages/Home';
// import QrRegister from './pages/QrRegister';
// import CustomerProducts from './pages/CustomerProducts';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./pages/Dashboard'),
  loading: Loading,
});

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: Loading,
});

const MyProfile = Loadable({
  loader: () => import('./pages/MyProfile'),
  loading: Loading,
});

const QrRegister = Loadable({
  loader: () => import('./pages/QrRegister'),
  loading: Loading,
});

const CustomerProducts = Loadable({
  loader: () => import('./pages/CustomerProducts'),
  loading: Loading,
});

const CompanyCustomers = Loadable({
  loader: () => import('./pages/CompanyCustomers'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/profile', exact: true, name: 'My profile', component: MyProfile },
  { path: '/dashboard', exact: true, role: true, name: 'Dashboard', component: Dashboard },
  { path: '/dashboard/register', exact: true, role: true, name: 'QR register', component: QrRegister },
  { path: '/dashboard/customers', exact: true, role: true, name: 'QR register', component: CompanyCustomers },
  { path: '/home', exact: true, role: false, name: 'Home', component: Home },
  { path: '/home/products', exact: true, role: false, name: 'My products', component: CustomerProducts },
];

export default routes;
