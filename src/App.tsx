import type { FC } from 'react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './Routes';

const App: FC = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;
