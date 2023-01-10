import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
