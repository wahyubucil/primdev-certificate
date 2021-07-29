import type { FC } from 'react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Home } from './pages/home';

export const Routes: FC = () => (
  <Switch>
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/" component={Home} />
  </Switch>
);
