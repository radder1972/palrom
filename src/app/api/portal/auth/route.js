import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to write/read OTPs locally
const getOtpDbPath = () => path.join(process.cwd(), 'otps.json');

function saveOtp(email, code) {
  const dbPath = getOtpDbPath();
  let store = {};
  try {
    if (fs.existsSync(dbPath)) {
      store = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to read OTP store, initializing new one', e);
  }
  
  // Save OTP with 10-minute expiry
  store[email.toLowerCase().trim()] = {
    code: String(code),
    expires: Date.now() + 10 * 60 * 1000 // 10 minutes from now
  };

  try {
    fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write to OTP store', e);
  }
}

export async function POST(request) {
  try {
    const { email, lang = 'nl' } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    
    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000);
    saveOtp(cleanEmail, otp);
    console.log(`[B2B Portal Auth] Generated OTP for ${cleanEmail}: ${otp}`);

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'PALROM Products <website@palromproducts.com>';
    
    const subjectDict = {
      nl: 'Toegangscode B2B Partner Portal - PALROM Products',
      en: 'Access Code for B2B Partner Portal - PALROM Products',
      de: 'Zugangscode für das B2B-Partnerportal - PALROM Products',
      ro: 'Cod de acces pentru Portalul B2B - PALROM Products'
    };
    
    const subject = subjectDict[lang] || subjectDict.en;

    const bodyDict = {
      nl: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e3a2b;">PALROM Products B2B Portal</h2>
          <p>Beste B2B partner,</p>
          <p>Gebruik de onderstaande 6-cijferige code om toegang te krijgen tot uw B2B Partner Portal. Deze code is 10 minuten geldig.</p>
          <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 15px; font-size: 24px; font-weight: 700; text-align: center; letter-spacing: 4px; color: #e7b124; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #718096; margin-top: 30px;">Als u deze code niet heeft aangevraagd, kunt u deze e-mail veilig negeren.</p>
        </div>
      `,
      en: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e3a2b;">PALROM Products B2B Portal</h2>
          <p>Dear B2B partner,</p>
          <p>Please use the following 6-digit access code to log in to your B2B Partner Portal. This code is valid for 10 minutes.</p>
          <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 15px; font-size: 24px; font-weight: 700; text-align: center; letter-spacing: 4px; color: #e7b124; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #718096; margin-top: 30px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
      de: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e3a2b;">PALROM Products B2B Portal</h2>
          <p>Sehr geehrter B2B-Partner,</p>
          <p>Bitte verwenden Sie den folgenden 6-stelligen Zugangscode, um sich in Ihrem B2B-Partnerportal anzumelden. Dieser Code ist 10 Minuten lang gültig.</p>
          <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 15px; font-size: 24px; font-weight: 700; text-align: center; letter-spacing: 4px; color: #e7b124; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #718096; margin-top: 30px;">Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.</p>
        </div>
      `,
      ro: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e3a2b;">Portal B2B PALROM Products</h2>
          <p>Stimate partener B2B,</p>
          <p>Vă rugăm să folosiți următorul cod de 6 cifre pentru a vă conecta la Portalul Partenerilor B2B. Acest cod este valabil timp de 10 minute.</p>
          <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 15px; font-size: 24px; font-weight: 700; text-align: center; letter-spacing: 4px; color: #e7b124; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #718096; margin-top: 30px;">Dacă nu ați solicitat acest cod, puteți ignora în siguranță acest e-mail.</p>
        </div>
      `
    };

    const htmlContent = bodyDict[lang] || bodyDict.en;

    let emailSent = false;
    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: cleanEmail,
            subject: subject,
            html: htmlContent
          })
        });

        if (resendRes.ok) {
          console.log(`[B2B Portal Auth] OTP email sent successfully to ${cleanEmail}`);
          emailSent = true;
        } else {
          const errText = await resendRes.text();
          console.error('[B2B Portal Auth] Resend API error:', errText);
          // Standard sandbox fallback
          if (errText.includes('validation_error') || errText.includes('testing emails')) {
            console.log('[B2B Portal Auth] Sandboxed Resend fallback: logging OTP to console and proceeding.');
          }
        }
      } catch (err) {
        console.error('[B2B Portal Auth] Failed to send email via Resend:', err);
      }
    } else {
      console.log('[B2B Portal Auth] Resend API key missing. OTP logged to terminal for local dev.');
    }

    return NextResponse.json({
      success: true,
      message: 'Access code sent',
      // If we are in local development without resend setup, we can return a flag
      testMode: !resendApiKey
    });
  } catch (error) {
    console.error('[B2B Portal Auth] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
