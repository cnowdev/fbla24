// Import the functions you need from the SDKs you need
import {apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId} from '@env'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
