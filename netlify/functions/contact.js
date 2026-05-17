exports.handler = async (event) => {
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
      return { statusCode: 400, body: JSON.stringify({ error: 'Name, email, and business are required.' }) };
    }

    // Forward to Formspree (more reliable from server-side)
    const formspreeResponse = await fetch('https://formspree.io/f/xplrqjlb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        business,
        email,
        phone: phone || 'Not provided',
        message: message || 'No message',
        _subject: `New RookOps Lead: ${name} - ${business}`,
      }),
    });

    if (!formspreeResponse.ok) {
      // Log but still return success to user
      console.error('Formspree error:', formspreeResponse.status, await formspreeResponse.text());
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
