import { Alert } from 'antd';
import React, { VFC, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Loader } from './components/Loader';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';

const Home = lazy(() => import('./pages/home'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Login = lazy(() => import('./pages/login'));

export const Routes: VFC = () => {
  const auth = useAuth();

  return (
    <Alert.ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route
            path="/login"
            render={() => {
              if (auth.user === null) return <Loader />;
              else if (auth.user) return <Redirect to="/dashboard" />;
              else return <Login />;
            }}
          />
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </Alert.ErrorBoundary>
  );
};
