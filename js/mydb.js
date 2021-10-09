firebase.initializeApp({
    apiKey: "AIzaSyCPmLNhrIRjznM5QPHPimj-smI9FyTTssQ",
    authDomain: "eventrex-328317.firebaseapp.com",
    projectId: "eventrex-328317",
    storageBucket: "eventrex-328317.appspot.com",
    messagingSenderId: "23091519004",
    appId: "1:23091519004:web:349f167605c8d3c29c49d9",
    measurementId: "G-45W9RE82W6"
});
firestore.settings({timestampsInSnapshots: true});
const db = firebase.firestore();