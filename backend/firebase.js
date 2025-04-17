import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import serviceAccount from "./serviceKey.json" assert {type: "json"};

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://wordsmiths-78b81-default-rtdb.firebaseio.com',
});

const db = getDatabase();
export default db;