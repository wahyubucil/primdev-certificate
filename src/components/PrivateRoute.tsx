import { getAuth } from 'firebase/auth';
import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';

type RouteProps = React.ComponentProps<typeof Route>;
export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const auth = getAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
