import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TimbraturaPresenze from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
serviceWorkerRegistration.register();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TimbraturaPresenze />
  </React.StrictMode>
);
