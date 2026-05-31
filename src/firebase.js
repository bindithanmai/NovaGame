import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyC1BMSl-K0WqDnVe8Iimlzdw40KYXksxSU',
  authDomain:        'novagame-63045.firebaseapp.com',
  projectId:         'novagame-63045',
  storageBucket:     'novagame-63045.firebasestorage.app',
  messagingSenderId: '719789150131',
  appId:             '1:719789150131:web:35b6d5a99cd1024fed05c6',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
