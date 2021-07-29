import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => (
  <>
    <h1>Home</h1>
    <Link to="/dashboard">To Dashboard</Link>
  </>
);

export default Home;
