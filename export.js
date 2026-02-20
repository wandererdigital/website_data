const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

async function exportData() {
  console.log("Starting export...");
  try {
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

    // This overwrites the existing file every time
    fs.writeFileSync('leaderboard.json', JSON.stringify(data, null, 2));
    console.log(`Finished! Exported ${data.length} users to leaderboard.json.`);
    process.exit(0);
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

exportData();
