import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from '../my-app/src/app.js';
import 'dotenv/config';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);