const admin = require('firebase-admin');

// --- Helper function to initialize Firebase Admin SDK ---
// This ensures we only initialize the app once per server instance.
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
  return admin.firestore();
}

const db = initializeFirebaseAdmin();

// --- Main Serverless Function Handler ---
export default async function handler(req, res) {
  // 1. Security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const formData = req.body;

  try {
    // 2. Determine which collection to save to based on the formType
    let collectionName = '';
    let emailSubject = '';
    let emailHtmlContent = '';

    switch (formData.formType) {
      case 'contact':
        collectionName = 'contacts';
        emailSubject = `New Contact Message: ${formData.subject || 'No Subject'}`;
        emailHtmlContent = `
          <p>You have a new contact message:</p>
          <ul>
            <li><strong>Name:</strong> ${formData.name || 'N/A'}</li>
            <li><strong>Email:</strong> ${formData.email || 'N/A'}</li>
            <li><strong>Subject:</strong> ${formData.subject || 'N/A'}</li>
            <li><strong>Message:</strong> ${formData.message || 'N/A'}</li>
          </ul>`;
        break;
      case 'trial':
        collectionName = 'trialRequests';
        emailSubject = `New Free Trial Request from ${formData.name}`;
        emailHtmlContent = `
          <p>You have a new free trial request:</p>
          <ul>
            <li><strong>Name:</strong> ${formData.name || 'N/A'}</li>
            <li><strong>Email:</strong> ${formData.email || 'N/A'}</li>
            <li><strong>Country:</strong> ${formData.country || 'N/A'}</li>
            <li><strong>Plan:</strong> ${formData.plan || 'N/A'}</li>
          </ul>`;
        break;
      case 'newsletter':
        collectionName = 'newsletter';
        emailSubject = `New Newsletter Subscription: ${formData.email}`;
        emailHtmlContent = `<p>A new user has subscribed: <strong>${formData.email}</strong></p>`;
        break;
      case 'channelList':
        collectionName = 'channelListRequests';
        emailSubject = `Channel List Request from ${formData.email}`;
        emailHtmlContent = `<p>A user requested the channel list:</p>
          <ul>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Region:</strong> ${formData.preferredRegion || 'N/A'}</li>
          </ul>`;
        break;
      default:
        throw new Error('Invalid form type provided.');
    }

    // 3. Save the data to Firestore
    await db.collection(collectionName).add({
      ...formData,
      createdAt: new Date(),
      status: 'new' // A consistent status for all submissions
    });

    // 4. Send the email notification using Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Your secret key from Vercel environment variables
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'GetTV.online', email: 'noreply@yourdomain.com' }, // Use a verified sender email from Brevo
        to: [{ email: 'your-admin-email@example.com' }], // **IMPORTANT: Change this to your admin email**
        subject: emailSubject,
        htmlContent: emailHtmlContent
      })
    });

    if (!brevoResponse.ok) {
      console.error('Brevo API Error:', await brevoResponse.json());
      // We don't throw an error here because the data is already saved.
      // The user gets a success message, but we log the email failure.
    }

    // 5. Send a success response back to the frontend
    return res.status(200).json({ message: 'Submission successful!' });

  } catch (error) {
    console.error('Error processing form:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}