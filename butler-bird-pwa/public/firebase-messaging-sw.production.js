/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBlWIYR4t1EYUoj-kRXV1P9WfCh2HOBFqM",
  authDomain: "butlerbird-dev.firebaseapp.com",
  projectId: "butlerbird-dev",
  storageBucket: "butlerbird-dev.appspot.com",
  messagingSenderId: "768125431899",
  appId: "1:768125431899:web:e5371535daaac4f7690f7e",
});

// eslint-disable-next-line no-restricted-globals
self.onnotificationclick = function (event) {
  event.notification.close();
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {});
