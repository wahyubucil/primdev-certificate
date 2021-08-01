import React, { VFC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProvideAuth } from './hooks/useAuth';
import { Routes } from './Routes';

const App: VFC = () => (
  <ProvideAuth>
    <Router>
      <Routes />
    </Router>
  </ProvideAuth>
);

export default App;
