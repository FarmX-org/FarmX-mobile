import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO2pO2P4d-O9uK8IP5R1_a0dt1kqiiZEs",
  authDomain: "farmchatapp-2e178.firebaseapp.com",
  projectId: "farmchatapp-2e178",
  storageBucket: "farmchatapp-2e178.appspot.com", 
  messagingSenderId: "1011705567232",
  appId: "1:1011705567232:web:98639b1e03a14c3c0520e5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

