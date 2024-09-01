import { initializeApp } from 'firebase/app';
import {getAnalytics, isSupported} from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
 apiKey: "AIzaSyC9_l-n1XXVwZo0PXwBh-0GzADYXS-phGQ",
 authDomain: "inventory-management-fir-8c3bf.firebaseapp.com",
 projectId: "inventory-management-fir-8c3bf",
 storageBucket: "inventory-management-fir-8c3bf.appspot.com",
 messagingSenderId: "314539803333",
 appId: "1:314539803333:web:2f250e252c6a98c6a3a6ac"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Initialize Analytics only if it's supported and running in the browser
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { firestore, analytics };