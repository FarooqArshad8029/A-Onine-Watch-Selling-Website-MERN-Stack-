importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyB2bkMeRoCMWG3eLq3xZl68b-7rhGX0fPo",
  authDomain: "clicky-1952d.firebaseapp.com",
  projectId: "clicky-1952d",
  storageBucket: "clicky-1952d.appspot.com",
  messagingSenderId: "797458448066",
  appId: "1:797458448066:web:714ec50aacc40f4f70855b",
  measurementId: "G-X6K1X014RS",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
