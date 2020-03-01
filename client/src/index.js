import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';

function index() {
    localStorage.setItem('loggedInStatus', false);
    localStorage.setItem('user', '');
    
    return <h1>index</h1>
}


export default index;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
