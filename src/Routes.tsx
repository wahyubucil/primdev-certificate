import { Alert } from 'antd';
import React, { VFC, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loader } from './components/Loader';

const Home = lazy(() => import('./pages/home'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Login = lazy(() => import('./pages/login'));

export const Routes: VFC = () => (
  <Alert.ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Home} />
      </Switch>
    </Suspense>
  </Alert.ErrorBoundary>
);
