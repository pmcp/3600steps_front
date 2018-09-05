import Firebase from 'firebase';

var firebaseApp = Firebase.initializeApp({
  apiKey: process.env.VUE_APP_FB_apiKey,
  authDomain: process.env.VUE_APP_FB_authDomain,
  databaseURL: process.env.VUE_APP_FB_databaseURL,
  projectId: process.env.VUE_APP_FB_projectId,
  storageBucket: process.env.VUE_APP_FB_storageBucket,
  messagingSenderId: process.env.VUE_APP_FB_messagingSenderId,
});


// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export var db = firebaseApp.database();
export var storage = firebaseApp.storage();

export const storageRef = firebaseApp.storage().ref();

