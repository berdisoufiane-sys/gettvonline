import admin from 'firebase-admin';

let db;
let firebaseAdminError = null;

// --- Helper function to initialize Firebase Admin SDK ---
// This ensures we only initialize the app once per server instance.
function initializeFirebaseAdmin() {
  // Check if already initialized
  if (admin.apps.length) {
    db = admin.firestore();
    return;
  }

  try {
    // Check if the environment variable is set
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    // Capture the error to be reported in the handler
    firebaseAdminError = `Firebase admin initialization error: ${error.message}. Please check that the FIREBASE_SERVICE_ACCOUNT_KEY environment variable is set correctly in Vercel.`;
    console.error(error.stack);
    // Explicitly return here to prevent db from being assigned on failure.
    return;
  }
  // Assign db only after a successful initialization.
  db = admin.firestore();
}

initializeFirebaseAdmin();

// --- Main Serverless Function Handler ---
export default async function handler(req, res) {
  // Check if Firebase Admin SDK initialized correctly
  if (firebaseAdminError) {
    console.error(firebaseAdminError);
    return res.status(500).json({ message: 'Server configuration error.', error: firebaseAdminError });
  }

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

        // Conditionally add MAC address if the device is a MAG box
        let macAddressHtml = '';
        if (formData.device && formData.device.toLowerCase().includes('mag') && formData.macAddress && formData.macAddress !== 'N/A') {
            macAddressHtml = `<li><strong>MAC Address:</strong> ${formData.macAddress}</li>`;
        }

        emailHtmlContent = `
          <p>You have a new free trial request:</p>
          <ul>
            <li><strong>Name:</strong> ${formData.name || 'N/A'}</li>
            <li><strong>Email:</strong> ${formData.email || 'N/A'}</li>
            <li><strong>Country:</strong> ${formData.country || 'N/A'}</li>
            <li><strong>Plan:</strong> ${formData.plan || 'N/A'}</li>
            <li><strong>Device:</strong> ${formData.device || 'N/A'}</li>
            ${macAddressHtml}
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
        sender: { name: 'GetTV.online', email: process.env.SENDER_EMAIL }, // Your verified sender email from Brevo
        to: [{ email: process.env.ADMIN_EMAIL }], // Your admin email to receive notifications
        subject: emailSubject,
        htmlContent: emailHtmlContent
      })
    });

    if (!brevoResponse.ok) {
      const errorBody = await brevoResponse.json();
      console.error('--- BREVO EMAIL SENDING FAILED ---');
      console.error(`Status: ${brevoResponse.status}`);
      console.error('Error Body:', JSON.stringify(errorBody, null, 2));
      console.error('ACTION: Please check your BREVO_API_KEY and ensure your SENDER_EMAIL is verified in your Brevo account.');
      // We still don't throw an error here because the data is already saved.
      // The user gets a success message, but we log the email failure.
    } else {
      // Log success to confirm the email API call was accepted.
      console.log('--- BREVO EMAIL API CALL SUCCEEDED ---');
      console.log(`Status: ${brevoResponse.status}`);
      console.log(`Email sent to: ${process.env.ADMIN_EMAIL} from ${process.env.SENDER_EMAIL}`);
    }

    // 5. Send a success response back to the frontend
    return res.status(200).json({ message: 'Submission successful!' });

  } catch (error) {
    console.error('Error processing form:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}