// One-off local utility: grants the "admin" custom claim used by firestore.rules
// to a specific Firebase Auth user. Run manually, never deployed with the site.
//
// Usage:
//   FIREBASE_SERVICE_ACCOUNT_KEY='{"...":"..."}' node scripts/set-admin-claim.js <uid-or-email>
//
// The UID/email must belong to the account that signs in at /admin/login.html.
import admin from 'firebase-admin';

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/set-admin-claim.js <uid-or-email>');
  process.exit(1);
}

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function main() {
  const user = target.includes('@')
    ? await admin.auth().getUserByEmail(target)
    : await admin.auth().getUser(target);

  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Granted "admin" claim to ${user.email || user.uid} (${user.uid}).`);
  console.log('The user must sign out and sign back in for the claim to take effect.');
}

main().catch((error) => {
  console.error('Failed to set admin claim:', error);
  process.exit(1);
});
