import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './Dashboard';
import reportWebVitals from './reportWebVitals';
import { YCAITheme } from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={YCAITheme}>
      <Dashboard />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('ycai--dashboard')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
void reportWebVitals();
