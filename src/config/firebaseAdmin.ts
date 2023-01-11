import * as firebaseAdmin from 'firebase-admin'

const serviceAccount = require("./firebaseServiceAccountKey.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

export default firebaseAdmin;