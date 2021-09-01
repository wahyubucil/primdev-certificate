import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProvideAuth } from './hooks/useAuth';
import { ProvideMetaMask } from './hooks/useMetaMask';
import { Routes } from './Routes';

const App: FC = () => (
  <ProvideAuth>
    <ProvideMetaMask>
      <Router>
        <Routes />
      </Router>
    </ProvideMetaMask>
  </ProvideAuth>
);

export default App;
