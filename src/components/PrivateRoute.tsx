import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from './Loader';

type RouteProps = React.ComponentProps<typeof Route>;
export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (auth.user === null) return <Loader />;
        else if (auth.user === false)
          return (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          );
        else return children;
      }}
    />
  );
};
