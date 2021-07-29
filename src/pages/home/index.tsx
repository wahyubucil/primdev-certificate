import React, { VFC } from 'react';
import { Link } from 'react-router-dom';

const Home: VFC = () => (
  <>
    <h1>Home</h1>
    <Link to="/dashboard">To Dashboard</Link>
  </>
);

export default Home;
