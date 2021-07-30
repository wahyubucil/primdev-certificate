import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config.json';
import App from './App';
import './index.scss';

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
