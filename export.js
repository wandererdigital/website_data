const admin = require('firebase-admin');
const fs = require('fs');

// Reads the secret we stored in GitHub Actions
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportData() {
  console.log("Starting export...");
  const snapshot = await db.collection('users').get();
  
  const data = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      username: d.username,
      level: d.level,
      adventures_completed: d.adventures_completed,
      xp: d.xp,
      discovered: d.discovered
    };
  });

  fs.writeFileSync('leaderboard.json', JSON.stringify(data, null, 2));
  console.log(`Finished! Exported ${data.length} users.`);
  process.exit();
}

exportData();
