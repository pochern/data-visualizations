import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Pins from './Pins'
import NivoCalendar from './NivoCalendar'

// Source data CSV
const DATA_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/icon/meteorites.json'

ReactDOM.render(
  <React.StrictMode>
    <Pins />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
