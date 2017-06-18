import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker';
import './index.css';


firebase.initializeApp({
     apiKey: "AIzaSyDDgeXzSmlb-LWd57ZkLt6m_OZs25wlMTM",
    authDomain: "copigram.firebaseapp.com",
    databaseURL: "https://copigram.firebaseio.com",
    projectId: "copigram",
    storageBucket: "copigram.appspot.com",
    messagingSenderId: "13229651647"
})


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
