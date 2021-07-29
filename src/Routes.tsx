import React, { VFC, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loader } from './components/Loader';

const Home = lazy(() => import('./pages/home'));
const Dashboard = lazy(() => import('./pages/dashboard'));

export const Routes: VFC = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/" component={Home} />
    </Switch>
  </Suspense>
);
