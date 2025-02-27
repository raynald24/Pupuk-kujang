import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './assets/app/store'; // pastikan path ini benar
import './index.css';
import App from './App.jsx';
import axios from 'axios';


axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
