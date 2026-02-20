const admin = require('firebase-admin');
const fs = require('fs');

// Verify the secret exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Error: FIREBASE_SERVICE_ACCOUNT secret is missing!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

async function exportData() {
  // This will help us debug
  console.log(`Attempting to connect to Project: ${serviceAccount.project_id}`);
  
  try {
    // We use db.collection('users').limit(1) just to test the connection
    const snapshot = await db.collection('users').get();
    
    if (snapshot.empty) {
      console.log("Connection successful, but the 'users' collection is empty.");
      fs.writeFileSync('leaderboard.json', JSON.stringify([], null, 2));
    } else {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      fs.writeFileSync('leaderboard.json', JSON.stringify(data, null, 2));
      console.log(`Success! exported ${data.length} documents.`);
    }
  } catch (error) {
    console.error("Detailed Error:", error.message);
    process.exit(1);
  }
}

exportData();
