import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Source data CSV
const DATA_URL = 'https://data.cityofnewyork.us/resource/qgea-i56i.csv';

require('d3-request').csv(DATA_URL, (error, response) => {
    if (!error) {
      const data = response.map(d => [Number(d.longitude), Number(d.latitude)]);
    ReactDOM.render(
      <React.StrictMode>
        <App data={data} />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
