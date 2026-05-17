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

    // Forward to Formspree (server-side, more reliable)
    const formspreeId = 'xplrqjlb';
    try {
      await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          business,
          email,
          phone: phone || 'Not provided',
          message: message || 'No additional message',
          _subject: `New RookOps Lead: ${name} - ${business}`,
        }),
      });
    } catch (e) {
      console.error('Formspree forward failed:', e);
    }

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

export const config = { path: '/api/contact' };
