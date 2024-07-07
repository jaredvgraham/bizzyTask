// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAfqUSw0lS95qGIYE2HpMJqYwobw2yFozI",
  authDomain: "business-plan-5ea9c.firebaseapp.com",
  projectId: "business-plan-5ea9c",
  storageBucket: "business-plan-5ea9c.appspot.com",
  messagingSenderId: "27475422696",
  appId: "1:27475422696:web:7df6b1ee4fc83732db085d",
  measurementId: "G-XBZE7XLKDW",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
