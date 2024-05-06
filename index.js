const admin = require('firebase-admin');
const serviceAccountSource = {
/* SOURCE SERVICE ACCOUNT */
};
const serviceAccountTarget = {
/* TARGET SERVICE ACCOUNT */
};
let collection = 'users'; // Change this

// Initialize source and target Firebase applications
const sourceApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountSource),
}, 'sourceApp');

const targetApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountTarget),
}, 'targetApp');

const sourceDb = admin.firestore(sourceApp);
const targetDb = admin.firestore(targetApp);

async function copyCollection(collectionPath) {
  const collectionRef = sourceDb.collection(collectionPath);
  const snapshot = await collectionRef.get();

  const docs = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    docs.push(targetDb.collection(collectionPath).doc(doc.id).set(data));
  });

  return Promise.all(docs);
}

async function main() {
  try {
    // Specify collections to copy
    await copyCollection(collection);
    console.log('Data copied successfully');
  } catch (error) {
    console.error('Error copying data', error);
  }
}

main();
