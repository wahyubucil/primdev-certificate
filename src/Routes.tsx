import React, { FC, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loader } from './components/Loader';

const Home = lazy(() => import('./pages/home'));
const Dashboard = lazy(() => import('./pages/dashboard'));

export const Routes: FC = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/" component={Home} />
    </Switch>
  </Suspense>
);
