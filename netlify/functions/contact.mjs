export default async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, business, email, phone, message } = data;

    if (!name || !email || !business) {
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name, email, and business are required.' }) 
      };
    }

    // Send email via Resend (free tier: 100 emails/day)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    let emailSent = false;
    
    if (RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'RookOps Contact <onboarding@resend.dev>',
            to: ['rookops1@gmail.com'],
            subject: `New RookOps Lead: ${name} - ${business}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <table style="border-collapse:collapse;width:100%;max-width:500px">
                <tr><td style="padding:8px;font-weight:bold;width:120px">Name:</td><td style="padding:8px">${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Business:</td><td style="padding:8px">${business}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Phone:</td><td style="padding:8px">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Message:</td><td style="padding:8px">${message || 'N/A'}</td></tr>
              </table>
              <p style="margin-top:16px;color:#666">— Sent from rookops.io contact form</p>
            `,
          }),
        });
        if (response.ok) {
          emailSent = true;
          console.log('Email sent successfully via Resend');
        } else {
          console.error('Resend error:', response.status, await response.text());
        }
      } catch (e) {
        console.error('Resend failed:', e);
      }
    }

    // Also try Formspree as backup
    try {
      await fetch('https://formspree.io/f/xplrqjlb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, business, email,
          phone: phone || 'Not provided',
          message: message || 'No additional message',
          _subject: `New RookOps Lead: ${name} - ${business}`,
        }),
      });
    } catch (e) {
      console.error('Formspree forward failed:', e);
    }

    console.log('CONTACT FORM SUBMISSION:', JSON.stringify({ name, business, email, phone: phone || 'N/A', message: message || 'N/A', emailSent }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: "Thanks! We'll be in touch soon." }),
    };
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};